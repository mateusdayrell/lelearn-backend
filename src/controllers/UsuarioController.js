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
        (SELECT COUNT(CV.cod_video) as qt_videos FROM cursos_videos CV WHERE CV.cod_curso = C.cod_curso AND CV.cod_video IN (SELECT V.cod_video FROM videos V WHERE V.deleted_at IS NULL)) as total_videos,
        (SELECT COUNT(UV.cpf) as qt_cpf FROM usuarios_videos UV, cursos_videos CV1 where UV.cpf = '${id}'
          AND UV.cod_curso = c.cod_curso AND CV1.cod_curso = c.cod_curso AND UV.cod_video = CV1.cod_video AND UV.cod_video IN (SELECT V.cod_video FROM videos V WHERE V.deleted_at IS NULL)) as videos_assistidos
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
        `SELECT T.cod_treinamento, T.nome_treinamento, T.cor, TU.prazo, T.desc_treinamento, TU.cursos_concluidos,

        (SELECT COUNT(TC.cod_curso) FROM treinamentos_cursos TC, cursos C WHERE TC.cod_treinamento = T.cod_treinamento AND
        TC.cod_curso = C.cod_curso AND C.deleted_at IS NULL)
        as total_cursos,

        T.desc_treinamento, T.created_at

        FROM treinamentos T, treinamentos_usuarios TU
        WHERE T.deleted_at IS NULL AND
        TU.cod_treinamento = T.cod_treinamento AND
        TU.cpf = '${id}' ORDER BY T.nome_treinamento`,
        { type: QueryTypes.SELECT },
      );

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

      const usuarioVideo = await UsuarioVideo.findOne({
        where: { cpf, cod_video, cod_curso },
      });

      // eslint-disable-next-line max-len
      if (usuarioVideo) await UsuarioVideo.destroy({ where: { cpf, cod_curso, cod_video } });
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
