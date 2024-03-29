module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('treinamentos', {
      cod_treinamento: {
        type: Sequelize.STRING(4),
        allowNull: false,
        primaryKey: true,
      },
      nome_treinamento: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      cor: {
        type: Sequelize.STRING(7),
        allowNull: false,
      },
      desc_treinamento: {
        type: Sequelize.TEXT,
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('treinamentos');
  },
};
