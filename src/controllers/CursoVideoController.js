import Curso from '../models/Curso';
import Video from '../models/Video';
import CursoVideo from '../models/CursoVideo';
import Comentario from '../models/Comentario';

class CursoVideoController {
  async index(req, res) {
    try {
      const cursosVideos = await CursoVideo.findAll({
        include: [
          {
            model: Curso,
            as: 'curso',
            include: [
              {
                model: Video,
                as: 'videos',
                attributes: ['cod_video', 'titulo_video'],
                order: ['titulo_video'],
              },
            ],
          },
          {
            model: Video,
            as: 'video',
            include: [
              {
                model: Comentario,
                as: 'comentarios',
                order: ['comentarios', 'created_at', 'DESC'],
              },
            ],
          },
        ],
      });
      return res.json(cursosVideos);
    } catch (error) {
      return res.json(null);
    }
  }

  async getCursos(req, res) {
    try {
      const cursosVideos = await CursoVideo.findAll({
        include: [
          {
            model: Curso,
            as: 'curso',
            include: [
              {
                model: Video,
                as: 'videos',
                attributes: ['cod_video', 'titulo_video'],
                order: ['titulo_video'],
              },
            ],
          },
        ],
        group: ['cod_curso'],
      });

      return res.json(cursosVideos);
    } catch (error) {
      return res.json(null);
    }
  }

  async getVideos(req, res) {
    try {
      const cursosVideos = await CursoVideo.findAll({
        include: [
          {
            model: Video,
            as: 'video',
            include: [
              {
                model: Comentario,
                as: 'comentarios',
                order: ['comentarios', 'created_at', 'DESC'],
              },
            ],
          },
        ],
      });
      return res.json(cursosVideos);
    } catch (error) {
      return res.json(null);
    }
  }

  async show(req, res) {
    try {
      console.log('entrou');
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
            include: [
              {
                model: Comentario,
                as: 'comentarios',
                order: ['comentarios', 'created_at', 'DESC'],
              },
            ],
          },
        ],
      });

      return res.json(cursoVideo);
    } catch (error) {
      return res.json(null);
    }
  }
}

export default new CursoVideoController();
