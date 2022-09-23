const { Model, DataTypes } = require('sequelize');
const { nanoid } = require('nanoid');

class Video extends Model {
  static init(sequelize) { // init Usuario
    super.init(
      { // init Model
        cod_video: {
          type: DataTypes.STRING,
          defaultValue: () => {
            const randomId = nanoid(4);
            return randomId;
          },
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
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do curso deve ter 4 caracteres.',
            },
          },
        },
        titulo_video: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [0, 40],
              msg: 'O título do vídeo deve ter no máximo 40 caracteres.',
            },
          },
        },
        desc_video: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            len: {
              args: [0, 150],
              msg: 'A descrição do vídeo deve ter no máximo 150 caracteres.',
            },
          },
        },
        link: {
          type: DataTypes.STRING,
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
    this.belongsTo(models.Curso, { as: 'curso', foreignKey: 'cod_curso' });
    this.hasMany(models.Comentario, { as: 'comentarios', foreignKey: 'cod_video' });
  }
}

module.exports = Video;
