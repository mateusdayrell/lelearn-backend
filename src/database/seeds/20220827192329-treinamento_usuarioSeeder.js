module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'treinamentos_usuarios',
      [
        {
          cod_treinamento: '0001',
          cpf: '00000000004',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0001',
          cpf: '00000000005',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0002',
          cpf: '00000000005',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0003',
          cpf: '00000000005',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0004',
          cpf: '00000000006',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],

      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('treinamentos_usuarios', null, {});
  },
};
