import Video from '../models/Video';
import Curso from '../models/Curso';

class VideoController {
  async index(req, res) {
    try {
      const videos = await Video.findAll();

      return res.json(videos);
    } catch (error) {
      return res.json(null);
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const video = await Video.findByPk(id, {
        include: [{model: Curso, as: 'curso', include: 'videos'}, 'comentarios']
      });

      return res.json(video);
    } catch (error) {
      return null
    }
  }

  async store(req, res) {
    try {
      const novoVideo = await Video.create(req.body);

      return res.json(novoVideo);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
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
          erros: ['Vídeo não existe.'],
        });
      }

      const videoEditado = await video.update(req.body);

      return res.json(videoEditado);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  }

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
  }
}

export default new VideoController();
