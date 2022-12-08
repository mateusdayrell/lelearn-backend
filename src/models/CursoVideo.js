/* eslint-disable consistent-return */
const { Model, DataTypes } = require('sequelize');
const handleHook = require('../helpers/CursoVideoHelper/hooksHelper');

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
        ordem: {
          type: DataTypes.INTEGER,
          defaultValue: '',
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'cursos_videos',
      },
    );

    this.addHook('afterSave', async (obj) => {
      try {
        const videosQtd = await this.count({
          where: { cod_curso: obj.cod_curso },
        });

        await handleHook(obj.cod_curso, videosQtd);
      } catch (error) {
        return JSON.stringify({
          erros: ['Erro ao executar hook.'],
        });
      }
    });

    this.addHook('afterBulkDestroy', async (obj) => {
      try {
        const videosQtd = await this.count({
          where: { cod_curso: obj.where.cod_curso },
        });
        await handleHook(obj.where.cod_curso, videosQtd);
      } catch (error) {
        return JSON.stringify({
          erros: ['Erro ao executar hook.'],
        });
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Curso, { foreignKey: 'cod_curso', as: 'curso', hooks: true });
    this.belongsTo(models.Video, { foreignKey: 'cod_video', as: 'video', hooks: true });
  }
}

module.exports = CursoVideo;
