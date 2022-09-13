import Video from '../models/Video';
import Curso from '../models/Curso';
import { Op } from "sequelize";

class VideoController {
  async index(req, res) {
    try {
      const videos = await Video.findAll({
        include: [{model: Curso, as: 'curso'}]
      });

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
        erros: error.errors.map((err) => {
          if (err.message === 'PRIMARY must be unique') {
            return 'Código do vídeo já cadastrado!';
          }
          return err.message
        }),
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
        erros: error.errors.map((err) => {
          if (err.message === 'PRIMARY must be unique') {
            return toast.error('Código do vídeo já cadastrado');
          }
          return err.message
        }),
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

  async search(req, res){
    try {
      const { search } = req.params;
      const urlParams = new URLSearchParams(search)

      const titulo_video = urlParams.get('titulo_video')
      const cod_curso = urlParams.get('cod_curso')
      console.log(titulo_video)
      const videos = await Video.findAll({
        where: {
          [Op.and]: [
            {titulo_video: { [Op.substring]: titulo_video}},
            {cod_curso: { [Op.substring]: cod_curso}},
          ]
        }
      }, {
        include: [{model: Curso, as: 'curso', include: 'videos'}, 'comentarios']
      })

      return res.json(videos);
    } catch (error) {
      console.log(error)
      return error
    }
  }
}

export default new VideoController();
