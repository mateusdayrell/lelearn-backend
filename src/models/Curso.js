import Sequelize, { Model } from 'sequelize';

class Curso extends Model {
  static init(sequelize) { // init Usuario
    super.init(
      { // init Model
        cod_curso: {
          type: Sequelize.STRING(4),
          primaryKey: true,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do curso deve ter 4 caracteres.',
            },
          },
        },
        nome_curso: {
          type: Sequelize.STRING(40),
          defaultValue: '',
          allowNull: false,
          validate: {
            len: {
              args: [3, 40],
              msg: 'O nome do curso deve ter entre 3 e 40 caracteres.',
            },
          },
        },
        desc_curso: {
          type: Sequelize.STRING(150),
          allowNull: true,
          validate: {
            len: {
              args: [0, 150],
              msg: 'A descrição do vídeo deve ter no máximo 150 caracteres.',
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
}

export default Curso;