import { Op } from 'sequelize';

import Curso from '../models/Curso';
import Video from '../models/Video';
import upload from '../services/multer';
import { apagarFotoCurso } from '../helpers/CursoHelper';
import CursoVideo from '../models/CursoVideo';

class CursoController {
  async index(req, res) {
    try {
      const cursos = await Curso.findAll({
        order: [['nome_curso']],
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
        include: {
          model: Video,
          as: 'videos',
          through: { attributes: ['ordem'] },
          order: [['cursos_videos', 'ordem']],
        },
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

        let videos = [];

        if (objCurso.videos) {
          videos = JSON.parse(objCurso.videos);
          delete objCurso.videos;
        }

        const novoCurso = await Curso.create(objCurso);

        if (videos.length > 0) {
          videos.forEach(async (video, index) => {
            await CursoVideo.create({
              cod_curso: novoCurso.cod_curso,
              cod_video: video.cod_video,
              ordem: index + 1,
            });
          });
        }

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

        // FOTO
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
        // FOTO

        // VIDEOS
        if (req.body.videos) {
          const videos = JSON.parse(req.body.videos);

          if (videos.length > 0) {
            const antigos = await CursoVideo.findAll({
              where: {
                cod_curso: id,
              },
              attributes: ['cod_video'],
              raw: true,
            });
            const arrAntigos = antigos.flatMap((el) => el.cod_video);

            videos.forEach(async (video, i) => {
              const index = arrAntigos.indexOf(video.cod_video);
              arrAntigos.splice(index, 1); // remover codigos ja atualizados

              const cursoVideo = await CursoVideo.findOne({
                where: { cod_curso: id, cod_video: video.cod_video },
              });

              if (!cursoVideo) { // create
                await CursoVideo.create({
                  cod_curso: id,
                  cod_video: video.cod_video,
                  ordem: i + 1,
                });
              } else { // update order
                await cursoVideo.update({
                  cod_curso: id,
                  cod_video: video.cod_video,
                  ordem: i + 1,
                });
              }
            });

            await CursoVideo.destroy({ // destroy
              where: {
                cod_curso: id,
                cod_video: [arrAntigos],
              },
            });
          } else {
            await curso.setVideos([]);
          }
        }
        // VIDEOS

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

  async getByVideo(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Video não enviado.'],
        });
      }

      const video = await Video.findByPk(id);

      const cursos = await video.getCursos();

      return res.json(cursos);
    } catch (error) {
      return res.json(null);
    }
  }
}

export default new CursoController();
