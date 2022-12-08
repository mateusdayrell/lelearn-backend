/* eslint-disable consistent-return */
const { Model, DataTypes } = require('sequelize');
const handleHook = require('../helpers/UsuarioVideoHelper.js/hooksHelper');

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

    this.addHook('afterSave', async (obj) => {
      try {
        const { cod_curso, cpf } = obj;

        const qtd = await this.count({
          where: { cpf, cod_curso },
        });

        await handleHook('save', obj, qtd);
      } catch (error) {
        return JSON.stringify({
          erros: ['Erro ao executar hook.'],
        });
      }
    });

    this.addHook('afterBulkDestroy', async (obj) => {
      try {
        const { cod_curso, cpf } = obj.where;

        const qtd = await this.count({
          where: { cpf, cod_curso },
        });

        await handleHook('destroy', obj.where, (qtd + 1));
      } catch (error) {
        return JSON.stringify({
          erros: ['Erro ao executar hook.'],
        });
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'cpf', as: 'usuario', hooks: true });
    this.belongsTo(models.Video, { foreignKey: 'cod_video', as: 'video', hooks: true });
    this.belongsTo(models.Curso, { foreignKey: 'cod_curso', as: 'curso', hooks: true });
  }
}

module.exports = UsuarioVideo;
