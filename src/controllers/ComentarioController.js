const Comentario = require('../models/Comentario');
const Usuario = require('../models/Usuario');
const Video = require('../models/Video');

module.exports = {
  async index(req, res) {
    try {
      const comentarios = await Comentario.findAll();
      return res.json(comentarios);
    } catch (error) {
      return res.json(null);
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

      const comentario = await Comentario.findByPk(id);

      return res.json(comentario);
    } catch (error) {
      return res.json(null);
    }
  },

  async store(req, res) {
    try {
      const erros = await validateBody(req.body, res);

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

      const erros = await validateBody(req.body, res);

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
};

const validateBody = async (body, res) => {
  try {
    const erros = [];
    const { cpf, cod_video, comentario } = body;

    if (!cpf) {
      erros.push('CPF não enviado.');
    }

    if (!cod_video) {
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
