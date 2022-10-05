/* eslint-disable no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'treinamentos_cursos',
      [
        {
          cod_treinamento: '0001',
          cod_curso: '0001',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0001',
          cod_curso: '0002',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0002',
          cod_curso: '0003',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0003',
          cod_curso: '0004',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0004',
          cod_curso: '0005',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],

      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('treinamentos_cursos', null, {});
  },
};
