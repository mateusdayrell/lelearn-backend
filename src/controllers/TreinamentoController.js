const { QueryTypes } = require('sequelize');
const Usuario = require('../models/Usuario');
const TreinamentoUsuario = require('../models/TreinamentoUsuario');

const Treinamento = require('../models/Treinamento');

module.exports = {
  async index(req, res) {
    try {
      const treinamentos = await Treinamento.findAll({
        order: [['nome_treinamento']],
      });

      return res.json(treinamentos);
    } catch (error) {
      return res.json(null);
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      const treinamento = await Treinamento.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'usuarios',
            attributes: ['cpf', 'nome'],
            through: { attributes: ['prazo'] },
          },
          'cursos',
        ],
        order: [['nome_treinamento'], ['usuarios', 'nome'], ['cursos', 'nome_curso']],
      });

      if (!treinamento) {
        return res.status(400).json({
          erros: ['Treinamento não existe.'],
        });
      }

      return res.json(treinamento);
    } catch (error) {
      return res.json(null);
    }
  },

  async store(req, res) {
    try {
      const { usuarios, cursos } = req.body;

      const novoTreinamento = await Treinamento.create(req.body);

      if (usuarios) {
        const usuariosArr = [];
        usuarios.forEach((u) => {
          usuariosArr.push(u.cpf);
        });
        await novoTreinamento.setUsuarios(usuariosArr);
      }

      if (cursos) {
        const cursosArr = [];
        cursos.forEach((c) => {
          cursosArr.push(c.cod_curso);
        });
        await novoTreinamento.setCursos(cursosArr);
      }

      return res.json(novoTreinamento);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { usuarios, cursos } = req.body;
      const cursosArr = [];

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      const treinamento = await Treinamento.findByPk(id);

      if (!treinamento) {
        const desativado = await Treinamento.findByPk(id, { paranoid: false });
        if (!desativado) {
          return res.status(400).json({
            erros: ['Treinamento não existe.'],
          });
        }
        return res.status(400).json({
          erros: ['O treinamento não pode ser editado pois está desativado.'],
        });
      }

      if (usuarios) { // USUARIOS
        const antigos = await TreinamentoUsuario.findAll({
          where: { cod_treinamento: id },
          attributes: ['cpf'],
          raw: true,
        });
        const arrAntigos = antigos.flatMap((el) => el.cpf);

        usuarios.forEach(async (u) => {
          const index = arrAntigos.indexOf(u.cpf);
          arrAntigos.splice(index, 1); // remover cpfs ja atualizados

          const tUsuario = await TreinamentoUsuario.findOne({
            where: {
              cpf: u.cpf, cod_treinamento: id,
            },
          });

          const objUsuario = {
            cpf: u.cpf,
            cod_treinamento: id,
            prazo: u.treinamentos_usuarios.prazo ? new Date(u.treinamentos_usuarios.prazo) : null,
          };

          if (tUsuario) await tUsuario.update(objUsuario); // UPDATE
          else await TreinamentoUsuario.create(objUsuario); // CREATE
        });

        if (arrAntigos.length > 0) {
          await TreinamentoUsuario.destroy({ // DESTROY
            where: {
              cod_treinamento: id,
              cpf: [arrAntigos],
            },
          });
        }
      } // USUARIOS

      if (cursos) {
        cursos.forEach((c) => {
          cursosArr.push(c.cod_curso);
        });
        await treinamento.setCursos(cursosArr);
      }

      const treinamentoEditado = await treinamento.update(req.body);

      return res.json(treinamentoEditado);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      const treinamento = await Treinamento.findByPk(id, { paranoid: false });

      if (!treinamento) {
        return res.status(400).json({
          erros: ['Treinamento não existe.'],
        });
      }

      const controle = treinamento.deleted_at !== null;

      if (controle) {
        await treinamento.setCursos(null);
        await treinamento.setUsuarios(null);
      }

      await treinamento.destroy({ force: controle });

      return res.json(treinamento); // também pode enviar null
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async activate(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      const [result] = await Treinamento.update(
        { deleted_at: null },
        {
          where: { cod_treinamento: id },
          paranoid: false,
        },
      );

      if (result === 0) {
        return res.status(400).json({
          erros: ['Erro ao ativar treicod_treinamento.'],
        });
      }

      return res.json(result);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async search(req, res) {
    try {
      const { search } = req.params;
      const urlParams = new URLSearchParams(search);

      const nome_treinamento = urlParams.get('nome_treinamento');
      const cpf = urlParams.get('cpf');
      const cod_curso = urlParams.get('cod_curso');
      const status = urlParams.get('status');

      const treinamentos = await Treinamento.sequelize.query(
        `SELECT T.cod_treinamento, T.nome_treinamento
        FROM treinamentos T
        WHERE
        ${nome_treinamento ? ` T.nome_treinamento LIKE '%${nome_treinamento}%' ` : ''}
        ${nome_treinamento && (cpf || cod_curso) ? 'AND' : ''}
        ${cpf ? `(SELECT TU.cpf FROM treinamentos_usuarios TU WHERE TU.cpf = ${cpf} AND TU.cod_treinamento = T.cod_treinamento)` : ''}
        ${cpf && cod_curso ? 'AND' : ''}
        ${cod_curso ? `(SELECT TC.cod_curso FROM treinamentos_cursos TC WHERE TC.cod_curso = ${cod_curso} AND TC.cod_treinamento = T.cod_treinamento) ` : ' '}
        ${cod_curso && status && status !== 'ambos' ? 'AND' : ''}
        ${status === 'inativo' ? ' T.deleted_at != NULL ' : ' T.deleted_at IS NULL '}`,
        { type: QueryTypes.SELECT },
      );

      return res.json(treinamentos);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async getCursosDoUsuario(req, res) {
    try {
      const { id, cpf } = req.params;

      if (!id || !cpf) {
        return res.status(400).json({
          erros: ['Parametros incorretos ou incompletos.'],
        });
      }

      const usuarioCursos = await Treinamento.sequelize.query(
        `SELECT C.cod_curso, C.nome_curso, C.desc_curso, C.nome_arquivo, C.created_at,
        (SELECT COUNT(CV.cod_video) as qt_videos FROM cursos_videos CV WHERE CV.cod_curso = C.cod_curso) as total_videos,
        (SELECT COUNT(UV.cpf) as qt_cpf FROM usuarios_videos UV where UV.cpf = ${cpf} AND UV.cod_curso = c.cod_curso) as videos_assistidos
         FROM cursos C, treinamentos_cursos TC
         WHERE C.deleted_at IS NULL AND
         TC.cod_treinamento = ${id} AND
         TC.cod_curso = C.cod_curso
         ORDER BY C.nome_curso`,
        { type: QueryTypes.SELECT },
      );

      return res.json(usuarioCursos);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },
};
