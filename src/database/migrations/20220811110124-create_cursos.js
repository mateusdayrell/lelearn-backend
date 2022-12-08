module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cursos', {
      cod_curso: {
        type: Sequelize.STRING(4),
        allowNull: false,
        primaryKey: true,
      },
      nome_curso: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
      },
      desc_curso: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      nome_arquivo: {
        type: Sequelize.STRING(23),
        allowNull: true,
      },
      videos_qtd: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
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
    await queryInterface.dropTable('cursos');
  },
};
