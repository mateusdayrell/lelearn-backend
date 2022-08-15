import Sequelize, { Model } from 'sequelize';

class Treinamento extends Model {
  static init(sequelize) { // init Treinamento
    super.init(
      { // init Model
        cod_treinamento: {
          type: Sequelize.STRING(4),
          primaryKey: true,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do treinamento deve ter 4 caracteres.',
            },
          },
        },
        nome_treinamento: {
          type: Sequelize.STRING(30),
          defaultValue: '',
          allowNull: false,
          validate: {
            len: {
              args: [3, 30],
              msg: 'O nome do treinamento deve ter entre 3 e 30 caracteres.',
            },
          },
        },
        desc_treinamento: {
          type: Sequelize.STRING(150),
          allowNull: true,
          validate: {
            len: {
              args: [0, 150],
              msg: 'A descrição do treinamento deve ter no máximo 150 caracteres.',
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
    this.belongsToMany(models.Usuario, {
      through: 'treinamentos_usuarios',
      as: 'usuarios',
      foreignKey: 'cod_treinamento',
    });

    this.belongsToMany(models.Cursos, {
      through: 'treinamentos_cursos',
      as: 'cursos',
      foreignKey: 'cod_treinamento',
    });
  }
}

export default Treinamento;
