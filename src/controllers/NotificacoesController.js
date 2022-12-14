const { Op } = require('sequelize');
const sequelize = require('sequelize');
const Usuario = require('../models/Usuario');
const Notificacao = require('../models/Notificacao');
const Comentario = require('../models/Comentario');
const Video = require('../models/Video');
const Curso = require('../models/Curso');

module.exports = {
  async index(req, res) {
    try {
      const notificacoes = await Notificacao.findAll({
        order: ['nome'],
      });

      return res.json(notificacoes);
    } catch (error) {
      return res.json(null);
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const notificacao = await Notificacao.findByPk(id);
      return res.json(notificacao);
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

  async getByUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['CPF não enviado.'],
        });
      }

      const notificacoes = await Notificacao.findAll({
        where: {
          [Op.and]: [
            { cpf: id },
            sequelize.literal('`Notificacao`.`cod_video` IN (SELECT V.cod_video from videos V WHERE V.deleted_at IS NULL)'),
            sequelize.literal('`Notificacao`.`cod_curso` IN (SELECT C.cod_curso from cursos C WHERE C.deleted_at IS NULL)'),
          ],
        },
        include: [
          { model: Comentario, as: 'comentario', include: { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] } },
          { model: Video, as: 'video', attributes: ['cod_video', 'titulo_video'] },
          { model: Curso, as: 'curso', attributes: ['cod_curso', 'nome_curso'] },
        ],
        order: [['created_at', 'DESC']],
      });

      return res.json(notificacoes);
    } catch (error) {
      console.log(error);
      return res.json(null);
    }
  },
};
