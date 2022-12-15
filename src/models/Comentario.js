/* eslint-disable brace-style */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
const { Model, DataTypes } = require('sequelize');
const { nanoid } = require('nanoid');
const Usuario = require('./Usuario');

const sendMail = require('../helpers/EmailHelper/sendMail');
const templates = require('../helpers/EmailHelper/templates');
const Video = require('./Video');

class Comentario extends Model {
  static init(sequelize) { // init Comentario
    super.init(
      { // init Model
        cod_comentario: {
          type: DataTypes.STRING,
          defaultValue: () => {
            const randomId = nanoid(4);
            return randomId;
          },
          primaryKey: true,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do comentário deve ter 4 caracteres.',
            },
          },
        },
        cpf: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [11, 11],
              msg: 'O CPF deve ter 11 caracteres.',
            },
          },
        },
        cod_video: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do vídeo deve ter 4 caracteres.',
            },
          },
        },
        cod_curso: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do curso deve ter 4 caracteres.',
            },
          },
        },
        comentario_pai: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do comentário pai deve ter 4 caracteres.',
            },
          },
        },
        texto: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            len: {
              args: [0, 150],
              msg: 'O comentário deve ter no máximo 150 caracteres.',
            },
          },
        },
        resolvido: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
      },
    );

    // eslint-disable-next-line consistent-return
    this.addHook('afterCreate', async (comentario) => {
      try {
        const usuario = await Usuario.findByPk(comentario.cpf);
        const admins = await Usuario.findAll({ where: { tipo: 0 } });
        const video = await Video.findByPk(comentario.cod_video);
        let comentarioPai = null;
        // let usuarioPai = null;

        if (comentario.comentario_pai) {
          comentarioPai = await this.findByPk(comentario.comentario_pai, {
            include: [
              { model: Comentario, as: 'respostas', include: { model: Usuario, as: 'usuario', attributes: ['cpf', 'tipo', 'email'] } },
              { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome', 'email'] },
            ],
          });
          // usuarioPai = await comentarioPai.getUsuario();
        }

        if (!comentario.comentario_pai) { // enviar email para administrador - USUARIO COMENTOU
          const template = await templates.notification1({
            nome: usuario.nome, video: video.cod_video, curso: comentario.cod_curso, titulo: video.titulo_video,
          }); // montar template de email

          for (const admin of admins) {
            if (usuario.cpf !== admin.cpf) {
              const enviado = await sendMail(admin.email, 'Novo comentário na plataforma LeLearn', template); // enviar email
              if (!enviado) JSON.stringify({ erros: ['Falha ao enviar email'] });
            }
          }
        }

        else if (usuario.tipo === 0) { // ADM RESPONDEU
          if (usuario.cpf !== comentarioPai.cpf) {
            // enviar para usuario do comentario pai
            const templatePai = await templates.notification2({
              video: video.cod_video, titulo: video.titulo_video, curso: comentario.cod_curso,
            });

            const enviado1 = await sendMail(comentarioPai.usuario.email, 'Novo comentário na plataforma LeLearn', templatePai); // enviar email
            if (!enviado1) JSON.stringify({ erros: ['Falha ao enviar email'] });

            // enviar para usuario das respostas comentario pai
            if (comentarioPai.respostas.length > 1) {
              for (const resposta of comentarioPai.respostas) {
                const templateResposta = await templates.notification5({
                  video: video.cod_video, titulo: video.titulo_video, curso: comentario.cod_curso,
                });
                if (usuario.cpf !== resposta.cpf) {
                  const enviado2 = await sendMail(resposta.email, 'Novo comentário na plataforma LeLearn', templateResposta); // enviar email
                  if (!enviado2) return JSON.stringify({ erros: ['Falha ao enviar email'] });
                }
              }
            }
          }
        }

        else if (usuario.tipo === 1) { // USUARIO RESPONDEU
          // enviar email para administradores
          const template = await templates.notification4({
            nome: usuario.nome, video: video.cod_video, curso: comentario.cod_curso, titulo: video.titulo_video,
          });

          for (const admin of admins) {
            if (usuario.cpf !== admin.cpf) {
              const enviado = await sendMail(admin.email, 'Novo comentário na plataforma LeLearn', template);
              if (!enviado) JSON.stringify({ erros: ['Falha ao enviar email'] });
            }
          }

          // enviar email para usuario do comentario pai
          const templatePai = await templates.notification3({
            nome: usuario.nome, video: video.cod_video, titulo: video.titulo_video, curso: comentario.cod_curso,
          });

          const enviado1 = await sendMail(comentarioPai.usuario.email, 'Novo comentário na plataforma LeLearn', templatePai);
          if (!enviado1) JSON.stringify({ erros: ['Falha ao enviar email'] });

          // enviar email para usuarios das respostas
          if (comentarioPai.respostas.length > 1) {
            for (const resposta of comentarioPai.respostas) {
              const templateResposta = await templates.notification6({
                nome: resposta.usuario.nome, video: video.cod_video, titulo: video.titulo_video, curso: comentario.cod_curso,
              });
              if (usuario.cpf !== resposta.cpf) {
                const enviado2 = await sendMail(resposta.email, 'Novo comentário na plataforma LeLearn', templateResposta);
                if (!enviado2) return JSON.stringify({ erros: ['Falha ao enviar email'] });
              }
            }
          }
        }

        // const obj = {
        //   tipo: (comentario.comentario_pai ? (usuario.tipo === 0 ? 0 : 2) : 1), // eslint-disable-line
        //   cod_comentario: comentario.comentario_pai || comentario.cod_comentario,
        //   cod_video: comentario.cod_video,
        //   cod_curso: comentario.cod_curso,
        // };

        // await Notificacao.create(obj);
      } catch (error) {
        console.log(error);
        return JSON.stringify({
          erros: ['Erro ao executar hook.'],
        });
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'cpf', as: 'usuario' });
    this.belongsTo(models.Video, { foreignKey: 'cod_video', as: 'video' });
    this.belongsTo(models.Curso, { foreignKey: 'cod_curso', as: 'curso' });
    this.hasMany(models.Comentario, { foreignKey: 'comentario_pai', as: 'respostas' });
    this.belongsTo(models.Comentario, { foreignKey: 'comentario_pai', as: 'pai' });
  }
}

module.exports = Comentario;
