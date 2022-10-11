import { Op } from 'sequelize';

import Curso from '../models/Curso';
import Video from '../models/Video';
import upload from '../services/multer';
import { apagarFotoCurso } from '../helpers/CursoHelper';

class CursoController {
  async index(req, res) {
    try {
      const cursos = await Curso.findAll({
        include: [{ model: Video, as: 'videos', attributes: ['cod_video', 'titulo_video', 'link'] }],
        order: [['nome_curso'], ['videos', 'titulo_video', 'ASC']],
      });
      return res.json(cursos);
    } catch (error) {
      return res.json(null);
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const curso = await Curso.findByPk(id, {
        include: 'videos',
        order: [['videos', 'titulo_video', 'ASC']],
      });

      return res.json(curso);
    } catch (error) {
      return res.json(null);
    }
  }

  async store(req, res) {
    try {
      return upload(req, res, async (error) => {
        if (error) {
          return res.status(400).json({
            erros: [error.code],
          });
        }

        const objCurso = { ...req.body };

        if (req.file) {
          const { filename } = req.file;
          objCurso.nome_arquivo = filename;
        }

        const novoCurso = await Curso.create(objCurso);

        return res.json(novoCurso);
      });
    } catch (error) {
      console.log(error);
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
          erros: ['Código do curso não enviado.'],
        });
      }

      const curso = await Curso.findByPk(id);

      if (!curso) {
        return res.status(400).json({
          erros: ['Curso não existe.'],
        });
      }

      return upload(req, res, async (error) => {
        if (error) {
          if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              erros: ['O arquivo deve ter no máximo 500kb!'],
            });
          }

          return res.status(400).json({
            erros: [error.code],
          });
        }

        const objCurso = { ...req.body };

        if (req.file) {
          const { filename } = req.file;
          objCurso.nome_arquivo = filename;
        }

        if (curso.nome_arquivo) {
          if (!apagarFotoCurso(curso.nome_arquivo)) {
            return res.status(400).json({
              erros: ['Erro ao excluir imagem'],
            });
          }
        }

        if (req.body.videos) { // atualizar videos
          const videos = JSON.parse(req.body.videos);

          if (videos.length > 0) {
            const videosArr = [];

            videos.forEach((vid) => {
              videosArr.push(vid.cod_video);
            });

            await curso.setVideos(videosArr);
          }
        }// atualizar videos

        const cursoEditado = await curso.update(objCurso);
        return res.json(cursoEditado);
      });
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
          erros: ['Código do curso não enviado.'],
        });
      }

      const curso = await Curso.findByPk(id);

      if (!curso) {
        return res.status(400).json({
          erros: ['Curso não existe.'],
        });
      }

      if (curso.nome_arquivo) {
        if (!apagarFotoCurso(curso.nome_arquivo)) {
          return res.status(400).json({
            erros: ['Erro ao excluir imagem'],
          });
        }
      }

      await curso.setVideos(null);
      await curso.destroy();

      return res.json(curso); // também pode enviar null
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  }

  async search(req, res) {
    try {
      const { search } = req.params;
      const urlParams = new URLSearchParams(search);

      const nome_curso = urlParams.get('nome_curso');
      const cod_video = urlParams.get('cod_video');

      const cursos = await Curso.findAll({
        where: {
          nome_curso: { [Op.substring]: nome_curso },
        },
        include: [
          {
            model: Video,
            as: 'videos',
            where: {
              cod_video: cod_video || { [Op.not]: null },
            },
          },
        ],
        order: [['nome_curso', 'ASC'], ['videos', 'titulo_video', 'ASC']],
      });

      return res.json(cursos);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default new CursoController();
