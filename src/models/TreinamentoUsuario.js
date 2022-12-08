const { Model, DataTypes } = require('sequelize');

class TreinamentoUsuario extends Model {
  static init(sequelize) { // init TreinamentoUsuario
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
        cod_treinamento: {
          type: DataTypes.STRING,
          primaryKey: true,
          validate: {
            len: {
              args: [4, 4],
              msg: 'O código do treinamento deve ter 4 caracteres.',
            },
          },
        },
        prazo: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        cursos_concluidos: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'treinamentos_usuarios',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'cpf' });
    this.belongsTo(models.Treinamento, { foreignKey: 'cod_treinamento' });
  }
}

module.exports = TreinamentoUsuario;
