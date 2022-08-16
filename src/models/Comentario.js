import Sequelize, { Model } from 'sequelize';

class Comentario extends Model {
  static init(sequelize) { // init Usuario
    super.init(
      { // init Model
        cod_comentario: {
          type: Sequelize.STRING,
          primaryKey: true,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do comentário deve ter 4 caracteres.',
            },
          },
        },
        cpf: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [11, 11],
              msg: 'O CPF deve ter 11 caracteres.',
            },
          },
        },
        cod_video: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do vídeo deve ter 4 caracteres.',
            },
          },
        },
        comentario: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O comentário vídeo deve ter 4 caracteres.',
            },
          },
        },
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'cpf' });
    this.belongsTo(models.Video, { foreignKey: 'cod_video' });
    this.belongsTo(models.Comentario, { foreignKey: 'comentario' });
  }
}

export default Comentario;
