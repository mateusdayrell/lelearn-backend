module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('videos', {
      cod_video: {
        type: Sequelize.STRING(4),
        allowNull: false,
        primaryKey: true,
      },
      titulo_video: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      desc_video: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      link: {
        type: Sequelize.STRING(150),
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
      daleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('videos');
  },
};
