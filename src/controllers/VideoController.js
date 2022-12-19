const { Op } = require('sequelize');
const sequelize = require('sequelize');
const Video = require('../models/Video');
const Curso = require('../models/Curso');
const Comentario = require('../models/Comentario');
const CursoVideo = require('../models/CursoVideo');

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
            model: Comentario,
            as: 'comentarios',
            where: sequelize.literal('`comentarios`.`cpf` = (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = `comentarios`.`cpf`)'),
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
        const desativado = await Video.findByPk(id, { paranoid: false });
        if (!desativado) {
          return res.status(400).json({
            erros: ['O vídeo não pode ser editado pois está desativado.'],
          });
        }
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

      const video = await Video.findByPk(id, { paranoid: false });

      if (!video) {
        return res.status(400).json({
          erros: ['video não existe.'],
        });
      }

      const controle = video.deleted_at !== null;

      await video.destroy({ force: controle });

      return res.json(video); // também pode enviar null
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
          erros: ['Código do vídeo não enviado.'],
        });
      }

      const [result] = await Video.update(
        { deleted_at: null },
        {
          where: { cod_video: id },
          paranoid: false,
        },
      );

      if (result === 0) {
        return res.status(400).json({
          erros: ['Erro ao ativar vídeo.'],
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

      const titulo_video = urlParams.get('titulo_video');
      const cod_curso = urlParams.get('cod_curso');
      const status = urlParams.get('status');

      const videos = await Video.findAll(
        cod_curso
          ? {
            paranoid: status === 'ativo',
            where: {
              [Op.and]: [
                titulo_video && { titulo_video: { [Op.substring]: titulo_video } },
                status === 'inativo'
                  ? { deleted_at: { [Op.not]: null } }
                  : '',
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
            paranoid: status === 'ativo',
            where: {
              [Op.and]: [
                titulo_video && { titulo_video: { [Op.substring]: titulo_video } },
                status === 'inativo'
                  ? { deleted_at: { [Op.not]: null } }
                  : '',
              ],
            },
            order: ['titulo_video'],
          },
      );
      console.log(videos);
      return res.json(videos);
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
          erros: ['Video não enviado.'],
        });
      }

      const video = await Video.findByPk(id, { paranoid: false });

      const cursos = await video.getCursos();

      return res.json(cursos);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async getByCurso(req, res) {
    try {
      const { cod_curso, cod_video } = req.params;

      if (!cod_curso) {
        return res.status(400).json({
          erros: ['Código do curso não enviado.'],
        });
      }

      if (!cod_video) {
        return res.status(400).json({
          erros: ['Código do vídeo não enviado.'],
        });
      }

      const cursoVideo = await CursoVideo.findOne({
        where: req.params,
        include: [
          {
            model: Curso,
            as: 'curso',
            include: [
              {
                model: Video,
                as: 'videos',
                attributes: ['cod_video', 'titulo_video'],
                through: { attributes: ['ordem', 'cod_curso'] },
              },
            ],
          },
          {
            model: Video,
            as: 'video',
            // include: [
            //   {
            //     model: Comentario,
            //     as: 'comentarios',
            //     order: ['comentarios', 'created_at', 'DESC'],
            //   },
            // ],
          },
        ],
      });

      return res.json(cursoVideo);
    } catch (error) {
      return res.json(null);
    }
  },
};
