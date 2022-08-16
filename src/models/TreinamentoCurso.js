const { Model, DataTypes } = require('sequelize');

class TreinamentoCurso extends Model {
  static init(sequelize) { // init TreinamentoCurso
    super.init(
      { // init Model
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
      },
      {
        sequelize,
        tableName: 'treinamentos_cursos',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Curso, { foreignKey: 'cod_curso' });
    this.belongsTo(models.Treinamento, { foreignKey: 'cod_treinamento' });
  }
}

module.exports = TreinamentoCurso;
