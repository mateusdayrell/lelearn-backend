const { Op, QueryTypes } = require('sequelize');
const Usuario = require('../models/Usuario');
const UsuarioVideo = require('../models/UsuarioVideo');

module.exports = {
  async index(req, res) {
    try {
      const usuarios = await Usuario.findAll({
        order: ['nome'],
      });

      return res.json(usuarios);
    } catch (error) {
      return res.json(null);
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.scope('resetPassword').findByPk(id);
      return res.json(usuario);
    } catch (error) {
      return res.json(null);
    }
  },

  async store(req, res) {
    try {
      const novoUsuario = await Usuario.create(req.body);

      return res.json(novoUsuario);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => {
          if (err.message === 'PRIMARY must be unique') {
            err.message = 'CPF já cadastrado!';
          }
          return err.message;
        }),
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['CPF não enviado.'],
        });
      }

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        const desativado = await Usuario.findByPk(id, { paranoid: false });
        if (!desativado) {
          return res.status(400).json({
            erros: ['Usuário não existe.'],
          });
        }
        return res.status(400).json({
          erros: ['O usuário não pode ser editado pois está desativado.'],
        });
      }

      const usuarioEditado = await usuario.update(req.body);

      return res.json(usuarioEditado);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => {
          if (err.message === 'PRIMARY must be unique') {
            err.message = 'CPF já cadastrado!';
          }
          return err.message;
        }),
      });
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['CPF não enviado.'],
        });
      }

      const usuario = await Usuario.findByPk(id, { paranoid: false });

      if (!usuario) {
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      const controle = usuario.deleted_at !== null;

      await usuario.destroy({
        force: controle,
      });

      return res.json(usuario); // também pode enviar null
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
          erros: ['CPF não enviado.'],
        });
      }

      const [result] = await Usuario.update(
        { deleted_at: null },
        {
          where: { cpf: id },
          paranoid: false,
        },
      );

      if (result === 0) {
        return res.status(400).json({
          erros: ['Erro ao ativar usuário.'],
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

      const cpf = urlParams.get('cpf');
      const nome = urlParams.get('nome');
      const tipo = urlParams.get('tipo');
      const status = urlParams.get('status');

      const usuarios = await Usuario.findAll({
        paranoid: status === 'ativo',
        where: {
          [Op.and]: [
            { cpf: { [Op.substring]: cpf } },
            { nome: { [Op.substring]: nome } },
            { tipo: { [Op.substring]: tipo } },
            status === 'inativo'
              ? { deleted_at: { [Op.not]: null } }
              : '',
          ],
        },
        order: ['nome'],
      });

      return res.json(usuarios);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async getVideos(req, res) {
    try {
      const { cpf, cod_curso } = req.params;

      if (!cpf || !cod_curso) {
        return res.status(400).json({
          erros: ['Parâmetros incorretos.'],
        });
      }

      const videosUsuarios = await UsuarioVideo.findAll({
        where: { cpf, cod_curso },
        attributes: ['cod_video'],
      });

      return res.json(videosUsuarios);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async getCursos(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['CPF não enviado.'],
        });
      }

      const usuarioCursos = await UsuarioVideo.sequelize.query(
        `SELECT C.cod_curso, C.nome_curso, C.desc_curso, C.nome_arquivo, C.created_at,
        (SELECT COUNT(CV.cod_video) as qt_videos FROM cursos_videos CV WHERE CV.cod_curso = C.cod_curso) as total_videos,
        (SELECT COUNT(UV.cpf) as qt_cpf FROM usuarios_videos UV where UV.cpf = ${id} AND UV.cod_curso = c.cod_curso) as videos_assistidos
         FROM cursos C WHERE C.deleted_at IS NULL ORDER BY C.nome_curso`,
        { type: QueryTypes.SELECT },
      );

      return res.json(usuarioCursos);
    } catch (error) {
      console.log(error);
      return res.json(null);
    }
  },

  async getTreinamentos(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['CPF não enviado.'],
        });
      }

      const treinamentosUsuarios = await Usuario.sequelize.query(
        `SELECT T.cod_treinamento, T.nome_treinamento, T.cor, TU.prazo, T.desc_treinamento,

        (SELECT COUNT(T1.cod_curso) FROM treinamentos_cursos T1, cursos C1 WHERE (SELECT COUNT(CV.cod_video)
          FROM cursos_videos CV WHERE CV.cod_curso = T1.cod_curso) = (SELECT COUNT(UV1.cod_video)
          FROM usuarios_videos UV1 WHERE UV1.cod_curso = T1.cod_curso AND UV1.cpf = ${id}) AND
          C1.cod_curso = T1.cod_curso AND C1.deleted_at IS NULL AND T1.cod_treinamento = T.cod_treinamento) as cursos_assistidos,

        (SELECT COUNT(TC.cod_curso) FROM treinamentos_cursos TC, cursos C WHERE TC.cod_treinamento = T.cod_treinamento AND
        TC.cod_curso = C.cod_curso AND C.deleted_at IS NULL)
        as total_cursos,

        T.desc_treinamento, T.created_at

        FROM treinamentos T, treinamentos_usuarios TU
        WHERE T.deleted_at IS NULL AND
        TU.cod_treinamento = T.cod_treinamento AND
        TU.cpf = ${id} ORDER BY T.nome_treinamento`,
        { type: QueryTypes.SELECT },
      );

      // eslint-disable-next-line max-len
      //   (SELECT COUNT(UV.cod_video) FROM usuarios_videos UV WHERE UV.cpf = ${id} AND UV.cod_curso IN  // (SELECT TC.cod_curso FROM treinamentos_cursos TC WHERE TC.cod_treinamento = T.cod_treinamento))
      // as videos_assistidos,

      return res.json(treinamentosUsuarios);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async updateVideo(req, res) {
    try {
      const { cpf, cod_video, cod_curso } = req.params;

      if (!cpf || !cod_video || !cod_curso) {
        return res.status(400).json({
          erros: ['Parâmetros incorretos.'],
        });
      }

      const usuario = await Usuario.findByPk(cpf);

      if (!usuario) {
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      const where = `WHERE cpf = ${cpf}
        AND cod_curso = ${cod_curso}
        AND cod_video = ${cod_video}`;

      const usuarioVideo = await UsuarioVideo.sequelize.query(
        `SELECT * FROM usuarios_videos ${where} LIMIT 1`,
        { type: QueryTypes.SELECT },
      );

      if (usuarioVideo.length > 0) await UsuarioVideo.sequelize.query(`DELETE FROM usuarios_videos ${where}`);
      else await UsuarioVideo.create(req.params);

      const videosUsuario = await UsuarioVideo.findAll({
        where: { cpf, cod_curso },
      });

      return res.json(videosUsuario);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },
};
