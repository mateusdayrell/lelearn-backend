module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cursos_videos', {
      cod_curso: {
        type: Sequelize.STRING(4),
        allowNull: true,
        references: {
          model: 'cursos',
          key: 'cod_curso',
        },
        primaryKey: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      cod_video: {
        type: Sequelize.STRING(4),
        allowNull: false,
        references: {
          model: 'videos',
          key: 'cod_video',
        },
        primaryKey: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      ordem: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('cursos_videos');
  },
};
