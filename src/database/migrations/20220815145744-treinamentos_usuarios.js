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
      },
      cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'cpf',
        },
        primaryKey: true,
        onDelete: 'CASCADE'
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
