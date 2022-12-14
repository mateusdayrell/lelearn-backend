const { Model, DataTypes } = require('sequelize');
const { nanoid } = require('nanoid');
const Usuario = require('./Usuario');
const Notificacao = require('./Notificacao');

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
        const comentarioPai = await this.findByPk(comentario.comentario_pai);
        const usuarioPai = await comentarioPai.getUsuario();

        if (usuario.cpf !== usuarioPai.cpf) {
          const obj = {
            tipo: (comentario.comentario_pai ? (usuario.tipo === 0 ? 0 : 2) : 1), // eslint-disable-line
            cod_comentario: comentario.comentario_pai || comentario.cod_comentario,
            cod_video: comentario.cod_video,
            cod_curso: comentario.cod_curso,
          };

          await Notificacao.create(obj);
        }
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
