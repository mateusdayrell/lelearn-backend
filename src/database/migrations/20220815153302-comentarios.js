module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comentarios', {
      cod_comentario: {
        type: Sequelize.STRING(4),
        allowNull: false,
        primaryKey: true,
      },
      cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'cpf',
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
      comentario_pai: {
        type: Sequelize.STRING(4),
        allowNull: true,
        references: {
          model: 'comentarios',
          key: 'cod_comentario',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      texto: {
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
    await queryInterface.dropTable('comentarios');
  },
};
