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
