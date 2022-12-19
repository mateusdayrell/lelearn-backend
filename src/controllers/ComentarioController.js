const { Op } = require('sequelize');
const sequelize = require('sequelize');
const Comentario = require('../models/Comentario');
const Usuario = require('../models/Usuario');
const Video = require('../models/Video');
const Curso = require('../models/Curso');

module.exports = {
  async index(req, res) {
    try {
      const comentarios = await Comentario.findAll({
        where: {
          [Op.and]: [
            { comentario_pai: null },
            { resolvido: 0 },
            sequelize.literal('`Comentario`.`cod_video` IN (SELECT V.cod_video from videos V WHERE V.deleted_at IS NULL)'),
            sequelize.literal('`Comentario`.`cpf` = (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = `Comentario`.`cpf`)'),
          ],
        },
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(C.cod_comentario) FROM comentarios C WHERE C.comentario_pai = `Comentario`.`cod_comentario` AND C.cpf IN (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = C.cpf))'), 'respostas_total'],
            [sequelize.literal('(SELECT COUNT(C.cod_comentario) FROM comentarios C WHERE C.comentario_pai = `Comentario`.`cod_comentario` AND C.resolvido = 0 AND C.cpf IN (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = C.cpf))'), 'respostas_pendentes'],
          ],
        },
        include: [
          { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
          { model: Video, as: 'video', include: { model: Curso, as: 'cursos', attributes: ['cod_curso', 'nome_curso'] } },
        ],
        order: [['created_at', 'DESC']],
      });
      return res.json(comentarios);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
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

      const comentario = await Comentario.findByPk(id, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.comentario_pai  = '${id}' AND C.cpf IN (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = C.cpf))`), 'respostas_total'],
            [sequelize.literal(`(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.comentario_pai = '${id}' AND C.cpf IN (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = C.cpf) AND resolvido = 0)`), 'respostas_pendentes'],
          ],
        },
        include: [
          { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
          {
            model: Comentario,
            as: 'respostas',
            include: { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
            where: sequelize.literal('`respostas`.`cod_comentario` IN (SELECT C.cod_comentario FROM comentarios C WHERE C.comentario_pai = `Comentario`.`cod_comentario` AND C.cpf IN (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = `respostas`.`cpf`))'),
          },
          { model: Video, as: 'video', include: { model: Curso, as: 'cursos', attributes: ['cod_curso', 'nome_curso'] } },
        ],
        order: [['respostas', 'created_at', 'ASC']],
      });
      return res.json(comentario);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async store(req, res) {
    try {
      const novoComentario = await Comentario.create(req.body);
      let comentarioPai = null;

      if (novoComentario.comentario_pai) {
        comentarioPai = await Comentario.findByPk(novoComentario.comentario_pai, {
          attributes: {
            include: [
              [sequelize.literal('(SELECT COUNT(C.cod_comentario) FROM comentarios C WHERE C.comentario_pai = `Comentario`.`cod_comentario` AND C.cpf IN (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = C.cpf))'), 'respostas_total'],
              [sequelize.literal('(SELECT COUNT(C.cod_comentario) FROM comentarios C WHERE C.comentario_pai = `Comentario`.`cod_comentario` AND C.resolvido = 0 AND C.cpf IN (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = C.cpf))'), 'respostas_pendentes'],
            ],
          },
          include: [
            { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
          ],
        });

        const usuario = await Usuario.findByPk(req.body.cpf);

        if (usuario.cpf !== comentarioPai.cpf && usuario.tipo === 1) {
          comentarioPai.set({ resolvido: 0 });
          await comentarioPai.save();
        }
      }

      return res.json({ novoComentario, comentarioPai });
    } catch (error) {
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
          erros: ['Código do comentario não enviado.'],
        });
      }

      const comentario = await Comentario.findByPk(id);

      if (!comentario) {
        return res.status(400).json({
          erros: ['Comentario não existe.'],
        });
      }

      const erros = await validateBody(req.body, res); // eslint-disable-line

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

  async getRootComments(req, res) {
    try {
      const { cod_video } = req.params;

      if (!cod_video) {
        return res.status(400).json({
          erros: ['Código do vídeo não enviado.'],
        });
      }

      const usuarios = await Usuario.findAll({ attributes: ['cpf'], raw: true });
      const cpfs = usuarios.map((u) => `'${u.cpf}'`);

      const comentarios = await Comentario.findAll({
        where: {
          [Op.and]: [
            { cod_video },
            { comentario_pai: null },
            sequelize.literal(`\`Comentario\`.\`cpf\` IN (${cpfs})`),
          ],
        },
        attributes: {
          include: [[sequelize.literal(`(SELECT COUNT(C.cod_comentario) FROM comentarios C WHERE C.comentario_pai = \`Comentario\`.\`cod_comentario\` AND C.cpf IN(${cpfs}))`), 'respostas_qtd']],
        },
        include: [
          { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
        ],
        order: [['created_at', 'DESC']],
        group: ['cod_comentario'],
      });

      return res.json(comentarios); // também pode enviar null
    } catch (error) {
      return res.status(400).json({
        erros: error.error.errors.map((err) => err.message),
      });
    }
  },

  async getRepplyes(req, res) {
    try {
      const { cod_comentario } = req.params;

      if (!cod_comentario) {
        return res.status(400).json({
          erros: ['Código do comentário não enviado.'],
        });
      }

      const comentarios = await Comentario.findAll({
        where: {
          [Op.and]: [
            { comentario_pai: cod_comentario },
            sequelize.literal('`Comentario`.`cpf` = (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = `Comentario`.`cpf`)'),
          ],
        },
        include: { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
        order: [['created_at', 'ASC']],
      });

      return res.json(comentarios); // também pode enviar null
    } catch (error) {
      return res.status(400).json({
        erros: error.error.errors.map((err) => err.message),
      });
    }
  },

  async search(req, res) {
    try {
      const { search } = req.params;
      const urlParams = new URLSearchParams(search);

      const texto = urlParams.get('texto');
      const cod_video = urlParams.get('cod_video');
      const videos = urlParams.get('videos');
      const cpf = urlParams.get('cpf');
      const resolvido = urlParams.get('resolvido');

      const comentarios = await Comentario.findAll({
        where: {
          [Op.and]: [
            texto && { texto: { [Op.substring]: texto } },
            cpf && { cpf },
            cod_video && { cod_video },
            (!cod_video && videos.length > 0) && { cod_video: { [Op.or]: videos.split(',') } },
            resolvido !== 'ambos' && ({ resolvido: resolvido }), // eslint-disable-line
            { comentario_pai: null },
            sequelize.literal('`Comentario`.`cod_video` IN (SELECT V.cod_video from videos V WHERE V.deleted_at IS NULL)'),
            sequelize.literal('`Comentario`.`cpf` = (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = `Comentario`.`cpf`)'),
          ],
        },
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(C.cod_comentario) FROM comentarios C WHERE C.comentario_pai = `Comentario`.`cod_comentario` AND C.cpf IN (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = C.cpf))'), 'respostas_total'],
            [sequelize.literal('(SELECT COUNT(C.cod_comentario) FROM comentarios C WHERE C.comentario_pai = `Comentario`.`cod_comentario` AND C.resolvido = 0 AND C.cpf IN (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = C.cpf))'), 'respostas_pendentes'],
          ],
        },
        include: [
          {
            model: Comentario,
            as: 'respostas',
            include: { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
            where: {
              [Op.and]: [
                sequelize.literal('`respostas`.`cpf` = (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = `respostas`.`cpf`)'),
                sequelize.literal('`respostas`.`cod_video` IN (SELECT V.cod_video from videos V WHERE V.deleted_at IS NULL)'),
              ],
            },
          },
          { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
          { model: Video, as: 'video', include: { model: Curso, as: 'cursos', attributes: ['cod_curso', 'nome_curso'] } },
        ],
        order: sequelize.literal('`respostas`.`created_at` DESC'),
      });

      return res.json(comentarios);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async resolve(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do comentario não enviado.'],
        });
      }

      const comentario = await Comentario.findByPk(id, { include: { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] } });

      const resolvido = comentario.resolvido ? 0 : 1;

      if (!comentario) {
        return res.status(400).json({
          erros: ['Comentario não existe.'],
        });
      }

      comentario.set({ resolvido });
      await comentario.save();

      const respostas = await comentario.getRespostas({
        include: { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome'] },
        where: sequelize.literal('`Comentario`.`cpf` IN (SELECT U.cpf from usuarios U WHERE U.deleted_at IS NULL AND U.cpf = `Comentario`.`cpf`)'),
      });
      // eslint-disable-next-line no-restricted-syntax
      for (const r of respostas) {
        const resposta = await Comentario.findByPk(r.cod_comentario);
        r.resolvido = resolvido === 1 ? 1 : 0;
        resposta.set({ resolvido });
        await resposta.save();
      }

      return res.json({ comentario, respostas });
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
    const { cpf, cod_video, comentario } = body; // eslint-disable-line

    if (!cpf) {
      erros.push('CPF não enviado.');
    }

    if (!cod_video) { // eslint-disable-line
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
    return res.status(400).json({
      erros: error,
    });
  }
};
