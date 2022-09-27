module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('treinamentos_cursos', {
      cod_treinamento: {
        type: Sequelize.STRING(4),
        allowNull: false,
        references: {
          model: 'treinamentos',
          key: 'cod_treinamento',
        },
        primaryKey: true,
        onDelete: 'cascade',
        onUpdate: 'CASCADE',
      },
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
    await queryInterface.dropTable('treinamentos_cursos');
  },
};
