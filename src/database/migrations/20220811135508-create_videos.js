module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('videos', {
      cod_video: {
        type: Sequelize.STRING(4),
        allowNull: false,
        primaryKey: true,
      },
      titulo_video: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      desc_video: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      link: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('videos');
  },
};
