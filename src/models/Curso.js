const { Model, DataTypes } = require('sequelize');
const { nanoid } = require('nanoid');
require('dotenv').config();

class Curso extends Model {
  static init(sequelize) { // init Usuario
    super.init(
      { // init Model
        cod_curso: {
          type: DataTypes.STRING(4),
          defaultValue: () => {
            const randomId = nanoid(4);
            return randomId;
          },
          primaryKey: true,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do curso deve ter 4 caracteres.',
            },
          },
        },
        nome_curso: {
          type: DataTypes.STRING(40),
          allowNull: false,
          unique: {
            args: true,
            msg: 'Nome do curso já cadastrado!',
          },
          validate: {
            len: {
              args: [3, 40],
              msg: 'O nome do curso deve ter entre 3 e 40 caracteres.',
            },
          },
        },
        desc_curso: {
          type: DataTypes.STRING(150),
          allowNull: true,
          validate: {
            len: {
              args: [0, 150],
              msg: 'A descrição do treinamento deve ter no máximo 150 caracteres.',
            },
          },
        },
        videos_qtd: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        nome_arquivo: {
          type: DataTypes.STRING,
          defaultValue: '',
          allowNull: true,
        },
        arquivo_url: {
          type: DataTypes.VIRTUAL,
          // eslint-disable-next-line consistent-return
          get() {
            if (this.getDataValue('nome_arquivo')) {
              return `${process.env.FILE_URL}/images/${this.getDataValue('nome_arquivo')}`;
            }
          },
        },
      },
      {
        sequelize,
        paranoid: true,
        deletedAt: 'deleted_at',
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Treinamento, {
      through: 'treinamentos_cursos',
      as: 'treinamentos',
      foreignKey: 'cod_curso',
    });

    this.belongsToMany(models.Video, {
      through: 'cursos_videos',
      as: 'videos',
      foreignKey: 'cod_curso',
      hooks: true,
    });

    this.belongsToMany(models.Usuario, {
      through: 'usuarios_videos',
      as: 'usuarios',
      foreignKey: 'cod_curso',
      hooks: true,
    });
  }
}

module.exports = Curso;
