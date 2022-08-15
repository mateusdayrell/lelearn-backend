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
      },
      cod_video: {
        type: Sequelize.STRING(4),
        allowNull: false,
        references: {
          model: 'videos',
          key: 'cod_video',
        },
      },
      comentario: {
        type: Sequelize.STRING(4),
        allowNull: true,
        references: {
          model: 'comentarios',
          key: 'cod_comentario',
        },
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
