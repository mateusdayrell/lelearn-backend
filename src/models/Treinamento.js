import Sequelize, { Model } from 'sequelize';

class Treinamento extends Model {
  static init(sequelize) { // init Treinamento
    super.init(
      { // init Model
        cod_treinamento: {
          type: Sequelize.STRING(4),
          allowNull: false,
          primaryKey: true,
          len: {
            args: [4, 4],
            msg: 'O código do treinamento deve ter 4 caracteres',
          },
        },
        nome_treinamento: {
          type: Sequelize.STRING(30),
          allowNull: false,
          len: {
            args: [3, 30],
            msg: 'O nome do treinamento deve ter entre 3 e 30 caracteres',
          },
        },
        desc_treinamento: {
          type: Sequelize.STRING(150),
          allowNull: true,
          len: {
            args: [0, 150],
            msg: 'O código do treinamento deve ter no máximo 150 caracteres',
          },
        },
      },
      {
        sequelize,
      },
    );
    return this;
  }
}

export default Treinamento;
