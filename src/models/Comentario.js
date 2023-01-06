/* eslint-disable brace-style */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
const { Model, DataTypes } = require('sequelize');
const { nanoid } = require('nanoid');
const Usuario = require('./Usuario');

const sendMail = require('../helpers/EmailHelper/sendMail');
const { comentarioTemplate } = require('../helpers/EmailHelper/templateComentario');
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
          type: DataTypes.TEXT(900),
          allowNull: false,
          defaultValue: '',
          validate: {
            len: {
              args: [0, 900],
              msg: 'O comentário deve ter no máximo 900 caracteres.',
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
        const video = await Video.findByPk(comentario.cod_video);
        let comentarioPai = null;
        let respostaEmails = null;

        if (comentario.comentario_pai) {
          comentarioPai = await this.findByPk(comentario.comentario_pai, {
            include: [
              { model: Comentario, as: 'respostas', include: { model: Usuario, as: 'usuario', attributes: ['cpf', 'tipo', 'email'] } },
              { model: Usuario, as: 'usuario', attributes: ['cpf', 'nome', 'email'] },
            ],
          });
          respostaEmails = comentarioPai.respostas.map((resp) => { if (resp.usuario.cpf !== usuario.cpf) return resp.usuario.email; }); // eslint-disable-line
        }

        if (usuario.tipo === 0) { //  ADM RESPONDEU
          const template = await comentarioTemplate({
            video: video.cod_video, curso: comentario.cod_curso, titulo: video.titulo_video,
          });

          const emails = [];
          if (respostaEmails) emails.push(respostaEmails);
          if (comentarioPai && usuario.cpf !== comentarioPai.cpf && comentarioPai) emails.push(comentarioPai.usuario.email);

          const enviado = await sendMail(emails, 'Novo comentário na plataforma LeLearn', template);
          if (!enviado) return JSON.stringify({ erros: ['Falha ao enviar email'] });

          // if (respostaEmails > 0) { // enviar para usuario das respostas comentario pai
          //   const enviado2 = await sendMail(respostaEmails, 'Novo comentário na plataforma LeLearn', template);
          //   if (!enviado2) return JSON.stringify({ erros: ['Falha ao enviar email'] });
          // }
        }
        // else if (usuario.tipo === 1) { // USUARIO RESPONDEU
        //   // enviar email para usuario do comentario pai
        //   if (usuario.cpf !== comentarioPai.cpf) {
        //     const templatePai = await templates.notification3({
        //       nome: usuario.nome, video: video.cod_video, titulo: video.titulo_video, curso: comentario.cod_curso,
        //     });
        //     const enviado1 = await sendMail(comentarioPai.usuario.email, 'Novo comentário na plataforma LeLearn', templatePai);
        //     if (!enviado1) JSON.stringify({ erros: ['Falha ao enviar email'] });
        //   }
        //   // enviar email para usuarios das respostas
        //   // if (respostaEmails > 1) {
        //   //   const templateResposta = await templates.notification6({
        //   //     video: video.cod_video, titulo: video.titulo_video, curso: comentario.cod_curso,
        //   //   });
        //   //   const enviado2 = await sendMail(respostaEmails, 'Novo comentário na plataforma LeLearn', templateResposta);
        //   //   if (!enviado2) return JSON.stringify({ erros: ['Falha ao enviar email'] });
        //   // }
        // }
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
