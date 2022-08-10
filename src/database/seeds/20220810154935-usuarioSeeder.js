const bcryptjs = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'usuarios',
      [
        {
          cpf: '00000000003',
          nome: 'Usuário Administrador',
          telefone: '38999999999',
          email: 'adm@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 0,
          data_nasc: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cpf: '00000000004',
          nome: 'Usuário Comum',
          telefone: '38988888888',
          email: 'comum@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 1,
          data_nasc: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],

      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
