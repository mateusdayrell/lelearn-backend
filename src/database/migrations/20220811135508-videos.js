module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('videos', {
      cod_video: {
        type: Sequelize.STRING(4),
        allowNull: false,
        primaryKey: true,
      },
      cod_curso: {
        type: Sequelize.STRING(4),
        allowNull: true,
        references: {
          model: 'cursos',
          key: 'cod_curso',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
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
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('videos');
  },
};
