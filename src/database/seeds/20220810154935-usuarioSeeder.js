const bcryptjs = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'usuarios',
      [
        {
          cpf: '00000000001',
          nome: 'Administrador',
          telefone: '38999999999',
          email: 'adm@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 0,
          data_nasc: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cpf: '00000000002',
          nome: 'Mateus Dayrell',
          telefone: '38988888888',
          email: 'dayrell@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 0,
          data_nasc: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cpf: '00000000003',
          nome: 'Marcos Gabriel',
          telefone: '38988888888',
          email: 'marcos@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 0,
          data_nasc: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cpf: '00000000004',
          nome: 'Italo',
          telefone: '38988888888',
          email: 'italo@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 1,
          data_nasc: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cpf: '00000000005',
          nome: 'Matheus de Souza',
          telefone: '38988888888',
          email: 'matheus@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 1,
          data_nasc: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cpf: '00000000006',
          nome: 'Leonardo Chaves',
          telefone: '38988888888',
          email: 'leo@email.com',
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
    return  queryInterface.bulkDelete('usuarios', null, {});
  },
};
