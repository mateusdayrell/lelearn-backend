/* eslint-disable no-unused-vars */
const { staticCpfs } = require('../../helpers/UsuarioHelper');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'treinamentos_usuarios',
      [
        {
          cod_treinamento: '0001',
          cpf: staticCpfs[0],
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0001',
          cpf: staticCpfs[1],
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0002',
          cpf: staticCpfs[2],
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0003',
          cpf: staticCpfs[3],
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0004',
          cpf: staticCpfs[4],
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0005',
          cpf: staticCpfs[5],
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
