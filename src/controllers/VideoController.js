const { Op } = require('sequelize');
const Video = require('../models/Video');
const Curso = require('../models/Curso');
const Comentario = require('../models/Comentario');

module.exports = {
  async index(req, res) {
    try {
      const videos = await Video.findAll({
        order: [['titulo_video']],
      });
      return res.json(videos);
    } catch (error) {
      return res.json(null);
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const video = await Video.findByPk(id, {
        include: [
          {
            model: Curso,
            as: 'cursos',
            attributes: ['cod_curso', 'nome_curso'],
            include: [{
              model: Video, as: 'videos', attributes: ['cod_video', 'titulo_video'], order: ['titulo_video'],
            }],
          },
          {
            model: Comentario, as: 'comentarios',
          },
        ],
        order: [['comentarios', 'created_at', 'DESC']],
      });

      return res.json(video);
    } catch (error) {
      return null;
    }
  },

  async store(req, res) {
    try {
      const { cursos } = req.body;
      const novoVideo = await Video.create(req.body);

      if (cursos) {
        const cursosArr = [];

        cursos.forEach((c) => {
          cursosArr.push(c.cod_curso);
        });

        await novoVideo.setCursos(cursosArr);
      }

      return res.json(novoVideo);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => {
          if (err.message === 'PRIMARY must be unique') {
            return res.json('Código do vídeo já cadastrado');
          }
          if (err.message === 'titulo_video must be unique') {
            err.message = 'Título já cadastrado!';
          }
          return err.message;
        }),
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { cursos } = req.body;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do vídeo não enviado.'],
        });
      }

      const video = await Video.findByPk(id);

      if (!video) {
        return res.status(400).json({
          erros: ['Vídeo não existe.'],
        });
      }

      if (cursos) {
        const cursosArr = [];

        cursos.forEach((c) => {
          cursosArr.push(c.cod_curso);
        });

        await video.setCursos(cursosArr);
      }

      const videoEditado = await video.update(req.body);

      return res.json(videoEditado);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => {
          if (err.message === 'PRIMARY must be unique') {
            return res.json('Código do vídeo já cadastrado');
          }
          if (err.message === 'titulo_video must be unique') {
            err.message = 'Título já cadastrado!';
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
          erros: ['Código do vídeo não enviado.'],
        });
      }

      const video = await Video.findByPk(id);

      if (!video) {
        return res.status(400).json({
          erros: ['video não existe.'],
        });
      }

      await video.destroy();

      return res.json(video); // também pode enviar null
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

      const titulo_video = urlParams.get('titulo_video');
      const cod_curso = urlParams.get('cod_curso');

      const videos = await Video.findAll(
        cod_curso
          ? {
            where: {
              [Op.and]: [
                { titulo_video: { [Op.substring]: titulo_video } },
              ],
            },
            include: [
              {
                model: Curso,
                as: 'cursos',
                where: {
                  cod_curso,
                },
              },
            ],
            order: [['titulo_video'], ['cursos', 'nome_curso']],
          }
          : {
            where: {
              [Op.and]: [
                { titulo_video: { [Op.substring]: titulo_video } },
              ],
            },
            order: ['titulo_video'],
          },
      );

      return res.json(videos);
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  async getByCurso(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Curso não enviado.'],
        });
      }

      const curso = await Curso.findByPk(id, { paranoid: false });

      const videos = await curso.getVideos({ joinTableAttributes: ['ordem'] });

      return res.json(videos);
    } catch (error) {
      return res.json(null);
    }
  },
};
