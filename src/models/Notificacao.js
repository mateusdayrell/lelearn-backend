const { Model, DataTypes } = require('sequelize');
const { nanoid } = require('nanoid');
require('dotenv').config();

class Notificacao extends Model {
  static init(sequelize) { // init Usuario
    super.init(
      { // init Model
        cod_notificacao: {
          type: DataTypes.STRING(4),
          defaultValue: () => {
            const randomId = nanoid(4);
            return randomId;
          },
          primaryKey: true,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código da notificação deve ter 4 caracteres.',
            },
          },
        },
        tipo: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cod_comentario: {
          type: DataTypes.STRING,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do comentário deve ter 4 caracteres.',
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
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do curso deve ter 4 caracteres.',
            },
          },
        },
      },
      {
        sequelize,
        tableName: 'notificacoes',
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Comentario, { foreignKey: 'cod_comentario', as: 'comentario' });
    this.belongsTo(models.Video, { foreignKey: 'cod_video', as: 'video' });
    this.belongsTo(models.Curso, { foreignKey: 'cod_curso', as: 'curso' });
  }
}

module.exports = Notificacao;
