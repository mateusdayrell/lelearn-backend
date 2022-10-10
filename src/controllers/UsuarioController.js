const { Op } = require('sequelize');
const Usuario = require('../models/Usuario');
const Video = require('../models/Video');

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
            return 'Código do vídeo já cadastrado!';
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
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      const usuarioEditado = await usuario.update(req.body);

      return res.json(usuarioEditado);
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
          erros: ['CPF não enviado.'],
        });
      }

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      await usuario.destroy();

      return res.json(usuario); // também pode enviar null
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

      const usuarios = await Usuario.findAll({
        where: {
          [Op.and]: [
            { cpf: { [Op.substring]: cpf } },
            { nome: { [Op.substring]: nome } },
            { tipo: { [Op.substring]: tipo } },
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
      const { cpf } = req.params;

      if (!cpf) {
        return res.status(400).json({
          erros: ['CPF não enviado.'],
        });
      }

      const usuario = await Usuario.findByPk(cpf, {
        include: [{
          model: Video,
          as: 'videos',
          through: { attributes: [] },
        }],
      });

      if (!usuario) {
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      return res.json(usuario.videos);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async updateVideo(req, res) {
    try {
      const { cpf, codVideo } = req.params;

      if (!cpf) {
        return res.status(400).json({
          erros: ['CPF não enviado.'],
        });
      }

      const usuario = await Usuario.findByPk(cpf);

      if (!usuario) {
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      if (await usuario.hasVideo(codVideo)) await usuario.removeVideo(codVideo);
      else await usuario.addVideo(codVideo);

      const usuarioVideos = await usuario.getVideos();

      return res.json(usuarioVideos);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },
};
