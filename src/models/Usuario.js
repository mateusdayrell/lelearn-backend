const { Model, DataTypes } = require('sequelize');
const bcryptjs = require('bcryptjs');

class Usuario extends Model {
  static init(sequelize) { // init Usuario
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
        nome: {
          type: DataTypes.STRING,
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
          type: DataTypes.STRING,
          defaultValue: '',
          allowNull: false,
          validate: {
            len: {
              args: [10, 11],
              msg: 'O telefone deve ter entre 10 e 11 caracteres.',
            },
            isInt: { args: true, msg: 'Telefone inválido' },
          },
        },
        email: {
          type: DataTypes.STRING,
          defaultValue: '',
          allowNull: false,
          unique: true,
          validate: {
            isEmail: {
              msg: 'Email inválido.',
            },
          },
        },
        senha: { // senha COM hash
          type: DataTypes.STRING,
          defaultValue: '',
        },
        password: { // senha SEM hash
          type: DataTypes.VIRTUAL,
          defaultValue: '',
          validate: {
            len: {
              args: [8, 15],
              msg: 'A senha deve ter entre 8 e 15 caracteres.',
            },
          },
        },
        tipo: {
          type: DataTypes.INTEGER,
          defaultValue: '',
          allowNull: false,
        },
        password_reset_token: {
          type: DataTypes.STRING,
          defaultValue: '',
        },
        password_reset_expires: {
          type: DataTypes.DATE,
          defaultValue: '',
        },
      },
      {
        defaultScope: {
          attributes: { exclude: ['password_reset_token', 'password_reset_expires'] },
        },
        scopes: {
          resetPassword: {
            attributes: { include: ['password_reset_token', 'password_reset_expires'] },
          },
        },
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

  validarSenha(senha) {
    return bcryptjs.compare(senha, this.senha);
  }

  static associate(models) {
    this.belongsToMany(models.Treinamento, {
      through: 'treinamentos_usuarios',
      as: 'treinamento',
      foreignKey: 'cpf',
    });
  }
}

module.exports = Usuario;
