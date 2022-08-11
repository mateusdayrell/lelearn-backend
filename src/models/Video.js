import Sequelize, { Model } from 'sequelize';

class Video extends Model {
  static init(sequelize) { // init Usuario
    super.init(
      { // init Model
        cod_video: {
          type: Sequelize.STRING(4),
          primaryKey: true,
          allowNull: false,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do vídeo deve ter 4 caracteres.',
            },
          },
        },
        cod_curso: {
          type: Sequelize.STRING(4),
          allowNull: true,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do curso deve ter 4 caracteres.',
            },
          },
        },
        titulo_video: {
          type: Sequelize.STRING(40),
          allowNull: false,
          validate: {
            len: {
              args: [0, 40],
              msg: 'O título do vídeo deve ter no máximo 40 caracteres.',
            },
          },
        },
        desc_video: {
          type: Sequelize.STRING(150),
          allowNull: true,
          validate: {
            len: {
              args: [0, 150],
              msg: 'A descrição do vídeo deve ter no máximo 150 caracteres.',
            },
          },
        },
        link: {
          type: Sequelize.STRING(150),
          allowNull: false,
          validate: {
            len: {
              args: [0, 150],
              msg: 'O link do vídeo deve ter no máximo 150 caracteres.',
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
    this.belongsTo(models.Curso, { foreignKey: 'cod_curso' });
  }
}

export default Video;
