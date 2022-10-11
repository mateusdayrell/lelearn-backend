const { Model, DataTypes } = require('sequelize');

class CursoVideo extends Model {
  static init(sequelize) { // init CursoVideo
    super.init(
      { // init Model
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
        tableName: 'cursos_videos',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Curso, { foreignKey: 'cod_curso' });
    this.belongsTo(models.Video, { foreignKey: 'cod_video' });
  }
}

module.exports = CursoVideo;
