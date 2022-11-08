const { Model, DataTypes } = require('sequelize');

class UsuarioVideo extends Model {
  static init(sequelize) { // init UsuarioVideo
    super.init(
      { // init Model
        cpf: {
          type: DataTypes.STRING,
          primaryKey: true,
          validate: {
            len: {
              args: [11, 11],
              msg: 'O CPF deve ter 11 caracteres.',
            },
          },
        },
        cod_curso: {
          type: DataTypes.STRING,
          primaryKey: true,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do curso deve ter 4 caracteres.',
            },
          },
        },
        cod_video: {
          type: DataTypes.STRING,
          primaryKey: true,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do vídeo deve ter 4 caracteres.',
            },
          },
        },
      },
      {
        sequelize,
        tableName: 'usuarios_videos',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'cpf', as: 'usuario' });
    this.belongsTo(models.Video, { foreignKey: 'cod_video', as: 'video' });
    this.belongsTo(models.Curso, { foreignKey: 'cod_curso', as: 'curso' });
  }
}

module.exports = UsuarioVideo;
