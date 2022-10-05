/* eslint-disable no-unused-vars */
const bcryptjs = require('bcryptjs');
const { staticCpfs } = require('../../helpers/UsuarioHelper');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'usuarios',
      [
        {
          cpf: staticCpfs[0],
          nome: 'Administrador',
          telefone: '38999999999',
          email: 'adm@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cpf: staticCpfs[1],
          nome: 'Mateus Dayrell',
          telefone: '38988888888',
          email: 'dayrell@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cpf: staticCpfs[2],
          nome: 'Marcos Gabriel',
          telefone: '38988888888',
          email: 'marcos@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cpf: staticCpfs[3],
          nome: 'Italo',
          telefone: '38988888888',
          email: 'italo@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cpf: staticCpfs[4],
          nome: 'Matheus de Souza',
          telefone: '38988888888',
          email: 'matheus@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cpf: staticCpfs[5],
          nome: 'Leonardo Chaves',
          telefone: '38988888888',
          email: 'leo@email.com',
          senha: await bcryptjs.hash('12345678', 8),
          tipo: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],

      {},
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('usuarios', null, {});
  },
};
