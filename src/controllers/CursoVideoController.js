import Curso from '../models/Curso';
import Video from '../models/Video';
import CursoVideo from '../models/CursoVideo';
import Comentario from '../models/Comentario';

class CursoVideoController {
  async show(req, res) {
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
