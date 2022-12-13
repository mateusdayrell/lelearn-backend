module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notificacoes', {
      cod_notificacao: {
        type: Sequelize.STRING(4),
        allowNull: false,
        primaryKey: true,
      },
      tipo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cod_comentario: {
        type: Sequelize.STRING(4),
        allowNull: true,
        references: {
          model: 'comentarios',
          key: 'cod_comentario',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      cod_curso: {
        type: Sequelize.STRING(4),
        allowNull: true,
        references: {
          model: 'cursos',
          key: 'cod_curso',
        },
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('notificacoes');
  },
};
