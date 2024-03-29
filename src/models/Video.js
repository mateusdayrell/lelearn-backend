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
        titulo_video: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            args: true,
            msg: 'Título do vídeo já cadastrado!',
          },
          validate: {
            len: {
              args: [0, 255],
              msg: 'O título do vídeo deve ter no máximo 255 caracteres.',
            },
          },
        },
        desc_video: {
          type: DataTypes.TEXT(900),
          allowNull: true,
          defaultValue: '',
          validate: {
            len: {
              args: [0, 900],
              msg: 'A descrição do vídeo deve ter no máximo 900 caracteres.',
            },
          },
        },
        link: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [0, 255],
              msg: 'O link do vídeo deve ter no máximo 255 caracteres.',
            },
          },
        },
      },
      {
        paranoid: true,
        deletedAt: 'deleted_at',
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    // this.belongsTo(models.Curso, { as: 'curso', foreignKey: 'cod_curso' });
    this.hasMany(models.Comentario, {
      as: 'comentarios',
      foreignKey: 'cod_video',
    });
    this.belongsToMany(models.Usuario, {
      through: 'usuarios_videos',
      as: 'usuarios',
      foreignKey: 'cod_video',
      hooks: true,
    });
    this.belongsToMany(models.Curso, {
      through: 'cursos_videos',
      as: 'cursos',
      foreignKey: 'cod_video',
      hooks: true,
    });
  }
}

module.exports = Video;
