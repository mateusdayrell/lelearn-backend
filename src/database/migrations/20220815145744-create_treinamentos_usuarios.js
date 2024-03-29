module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('treinamentos_usuarios', {
      cod_treinamento: {
        type: Sequelize.STRING(4),
        allowNull: false,
        references: {
          model: 'treinamentos',
          key: 'cod_treinamento',
        },
        primaryKey: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'cpf',
        },
        primaryKey: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      prazo: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      cursos_concluidos: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('treinamentos_usuarios');
  },
};
