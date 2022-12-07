const { fn, col, Op } = require('sequelize');
const sequelize = require('sequelize');
const Comentario = require('../models/Comentario');
const Usuario = require('../models/Usuario');
const Video = require('../models/Video');
const Curso = require('../models/Curso');

module.exports = {
  async index(req, res) {
    try {
      const comentarios = await Comentario.findAll({
        where: {
          comentario_pai: null,
        },
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.comentario_pai = `Comentario`.`cod_comentario`)'), 'respostas_total'],
            [sequelize.literal('(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.comentario_pai = `Comentario`.`cod_comentario` AND resolvido = 0)'), 'respostas_pendentes'],
          ],
        },
        include: [
          { model: Comentario, as: 'respostas', include: { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] } },
          { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
          { model: Video, as: 'video', include: { model: Curso, as: 'cursos', attributes: ['cod_curso', 'nome_curso'] } },
        ],
        order: [['created_at', 'DESC'], ['respostas', 'created_at', 'ASC']],
      });
      return res.json(comentarios);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do comentário não enviado.'],
        });
      }

      const comentario = await Comentario.findByPk(id, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(cod_comentario) FROM comentarios WHERE comentarios.comentario_pai  = '${id}')`), 'respostas_total'],
            [sequelize.literal(`(SELECT COUNT(cod_comentario) FROM comentarios WHERE comentarios.comentario_pai = '${id}' AND resolvido = 0)`), 'respostas_pendentes'],
          ],
        },
        include: [
          { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
          {
            model: Comentario,
            as: 'respostas',
            include: { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
          },
          { model: Video, as: 'video', include: { model: Curso, as: 'cursos', attributes: ['cod_curso', 'nome_curso'] } },
        ],
        order: [['respostas', 'created_at', 'ASC']],
      });

      return res.json(comentario);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async store(req, res) {
    try {
      const erros = await validateBody(req.body, res); // eslint-disable-line

      if (erros.length > 0) {
        return res.status(400).json({
          erros,
        });
      }

      const novoComentario = await Comentario.create(req.body);
      return res.json(novoComentario);
    } catch (error) {
      return res.status(400).json({
        erros: error,
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do comentario não enviado.'],
        });
      }

      const comentario = await Comentario.findByPk(id);

      if (!comentario) {
        return res.status(400).json({
          erros: ['Comentario não existe.'],
        });
      }

      const erros = await validateBody(req.body, res); // eslint-disable-line

      if (erros.length > 0) {
        return res.status(400).json({
          erros,
        });
      }

      const comentarioEditado = await comentario.update(req.body);

      return res.json(comentarioEditado);
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
          erros: ['Código do comentario não enviado.'],
        });
      }

      const comentario = await Comentario.findByPk(id);

      if (!comentario) {
        return res.status(400).json({
          erros: ['Comentario não existe.'],
        });
      }

      await comentario.destroy();

      return res.json(comentario); // também pode enviar null
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async getRootComments(req, res) {
    try {
      const { cod_video } = req.params;

      if (!cod_video) {
        return res.status(400).json({
          erros: ['Código do vídeo não enviado.'],
        });
      }

      const comentarios = await Comentario.findAll({
        where: {
          cod_video, comentario_pai: null,
        },
        attributes: {
          include: [[fn('COUNT', col('respostas.cod_comentario')), 'respostas_qtd']],
        },
        include: [
          { model: Comentario, as: 'respostas', attributes: [] },
          { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
        ],
        order: [['created_at', 'DESC']],
        group: ['cod_comentario'],
      });

      return res.json(comentarios); // também pode enviar null
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        erros: error, // error.errors.map((err) => err.message),
      });
    }
  },

  async getRepplyes(req, res) {
    try {
      const { cod_comentario } = req.params;

      if (!cod_comentario) {
        return res.status(400).json({
          erros: ['Código do comentário não enviado.'],
        });
      }

      const comentarios = await Comentario.findAll({
        where: {
          comentario_pai: cod_comentario,
        },
        include: { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
        order: [['created_at', 'ASC']],
      });

      return res.json(comentarios); // também pode enviar null
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        erros: error, // error.errors.map((err) => err.message),
      });
    }
  },

  async search(req, res) {
    try {
      const { search } = req.params;
      const urlParams = new URLSearchParams(search);

      const texto = urlParams.get('texto');
      const cod_video = urlParams.get('cod_video');
      const videos = urlParams.get('videos');
      const cpf = urlParams.get('cpf');

      const comentarios = await Comentario.findAll({
        where: {
          [Op.and]: [
            texto && { texto: { [Op.substring]: texto } },
            cpf && { cpf },
            cod_video && { cod_video },
            (!cod_video && videos.length > 0) && { cod_video: { [Op.or]: videos.split(',') } },
          ],
        },
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.comentario_pai = `Comentario`.`cod_comentario`)'), 'respostas_total'],
            [sequelize.literal('(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.comentario_pai = `Comentario`.`cod_comentario` AND resolvido = 0)'), 'respostas_pendentes'],
          ],
        },
        include: [
          { model: Comentario, as: 'respostas' },
          { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
          { model: Video, as: 'video', include: { model: Curso, as: 'cursos', attributes: ['cod_curso', 'nome_curso'] } },
        ],
        order: [['created_at', 'ASC']],
      });

      return res.json(comentarios);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },
};

const validateBody = async (body, res) => {
  try {
    const erros = [];
    const { cpf, cod_video, comentario } = body; // eslint-disable-line

    if (!cpf) {
      erros.push('CPF não enviado.');
    }

    if (!cod_video) { // eslint-disable-line
      erros.push('Código do vídeo não enviado.');
    }

    if (comentario) {
      const coment = await Comentario.findByPk(comentario);
      if (!coment) {
        erros.push('Comentário não encontrado.');
      }
    }

    const usuario = await Usuario.findByPk(cpf);
    const video = await Video.findByPk(cod_video);

    if (!usuario) {
      erros.push('Usuário não existe.');
    }

    if (!video) {
      erros.push('Vídeo não existe.');
    }

    return erros;
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      erros: error,
    });
  }
};
