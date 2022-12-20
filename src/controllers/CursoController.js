const { Op } = require('sequelize');

const sequelize = require('sequelize');
const Curso = require('../models/Curso');
const Video = require('../models/Video');
const upload = require('../services/multer');
const { apagarFotoCurso } = require('../helpers/CursoHelper');
const CursoVideo = require('../models/CursoVideo');
const Usuario = require('../models/Usuario');

module.exports = {
  async index(req, res) {
    try {
      const cursos = await Curso.findAll({
        order: [['nome_curso']],
      });
      return res.json(cursos);
    } catch (error) {
      return res.json(null);
    }
  },

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
  },

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
  },

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
        const desativado = await Curso.findByPk(id, { paranoid: false });
        if (!desativado) {
          return res.status(400).json({
            erros: ['Curso não existe.'],
          });
        }
        return res.status(400).json({
          erros: ['O curso não pode ser editado pois está desativado.'],
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
        objCurso.nome_arquivo = req.file ? req.file.filename : null;

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

            if (arrAntigos.length > 0) {
              await CursoVideo.destroy({ // destroy
                where: {
                  cod_curso: id,
                  cod_video: [arrAntigos],
                },
              });
            }
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
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do curso não enviado.'],
        });
      }

      const curso = await Curso.findByPk(id, { paranoid: false });

      if (!curso) {
        return res.status(400).json({
          erros: ['Curso não existe.'],
        });
      }

      const controle = curso.deleted_at !== null;

      if (curso.nome_arquivo && controle) {
        if (!apagarFotoCurso(curso.nome_arquivo)) { // apagar foto
          return res.status(400).json({
            erros: ['Erro ao excluir imagem'],
          });
        }
      }

      if (controle) await curso.setVideos(null); // remover videos

      await curso.destroy({ // apagar curso
        force: controle,
      });

      return res.json(curso); // também pode enviar null
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
          erros: ['Código do curso não enviado.'],
        });
      }

      const [result] = await Curso.update(
        { deleted_at: null },
        {
          where: { cod_curso: id },
          paranoid: false,
        },
      );

      if (result === 0) {
        return res.status(400).json({
          erros: ['Erro ao ativar curso.'],
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

      const nome_curso = urlParams.get('nome_curso');
      const cod_video = urlParams.get('cod_video');
      const status = urlParams.get('status');

      const cursos = await Curso.findAll({
        paranoid: status === 'ativo',
        where: {
          [Op.and]: [
            { nome_curso: { [Op.substring]: nome_curso } },
            status === 'inativo'
              ? { deleted_at: { [Op.not]: null } }
              : '',
          ],
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
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async getVideos(req, res) {
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

  async mostWatched(req, res) {
    try {
      console.log('AAAAAAAAAAAA');
      const videos = await Video.findAll({ attributes: ['cod_video'], raw: true });
      const codVideos = videos.map((v) => `'${v.cod_video}'`);

      const cur = await Curso.findAll({ attributes: ['cod_curso'], raw: true });
      const codCursos = cur.map((c) => `'${c.cod_curso}'`);

      const usuarios = await Usuario.findAll({ attributes: ['cpf'], raw: true });
      const cpfs = usuarios.map((u) => `'${u.cpf}'`);

      const cursos = await Curso.findAll({
        attributes: {
          include: [[sequelize.literal(`(SELECT COUNT(cod_curso) FROM usuarios_videos WHERE cod_video IN (${codVideos}) AND cod_curso IN (${codCursos}) AND cpf IN (${cpfs}) AND cod_curso = \`Curso\`.\`cod_curso\` )`), 'visualizacoes']],
        },
        limit: 3,
        order: [['visualizacoes', 'DESC']],
      });

      const json = JSON.stringify(cursos);
      const obj = JSON.parse(json);

      const arr = [];

      obj.map((c) => { // eslint-disable-line
        if (c.visualizacoes > 0) arr.push(c);
      });

      return res.json(arr);
    } catch (error) {
      console.log(error);
      return res.json(null);
    }
  },
};
