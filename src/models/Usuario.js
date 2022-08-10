import Sequelize, { Model } from 'sequelize';
import bcryptjs from 'bcryptjs';

class Usuario extends Model {
  static init(sequelize) { // init Usuario
    super.init(
      { // init Model
        cpf: {
          type: Sequelize.STRING(11),
          primaryKey: true,
          validate: {
            len: {
              args: [11, 11],
              msg: 'O CPF deve ter 11 caracteres.',
            },
          },
        },
        nome: {
          type: Sequelize.STRING(40),
          defaultValue: '',
          allowNull: false,
          validate: {
            len: {
              args: [3, 40],
              msg: 'O nome deve ter entre 3 e 40 caracteres.',
            },
          },
        },
        telefone: {
          type: Sequelize.STRING(11),
          defaultValue: '',
          allowNull: false,
          validate: {
            len: {
              args: [10, 11],
              msg: 'O telefone deve ter entre 10 e 11 caracteres.',
            },
          },
        },
        email: {
          type: Sequelize.STRING(50),
          defaultValue: '',
          allowNull: false,
          unique: true,
          validate: {
            isEmail: {
              msg: 'Email inválido.',
            },
          },
        },
        senha: {
          type: Sequelize.STRING,
          defaultValue: '',
        },
        password: {
          type: Sequelize.VIRTUAL,
          defaultValue: '',
          validate: {
            len: {
              args: [8, 15],
              msg: 'A senha deve ter entre 8 e 15 caracteres.',
            },
          },
        },
        tipo: {
          type: Sequelize.INTEGER,
          defaultValue: '',
          allowNull: false,
        },
        data_nasc: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
      },
    );

    this.addHook('beforeSave', async (usuario) => {
      if (usuario.password) {
        usuario.senha = await bcryptjs.hash(usuario.password, 8);
      }
    });

    return this;
  }
}

export default Usuario;
