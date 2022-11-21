/* eslint-disable no-unused-vars */
const { faker } = require('@faker-js/faker/locale/pt_BR');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'treinamentos',
      [
        {
          cod_treinamento: '0001',
          nome_treinamento: 'Treinamento 1',
          cor: '#81D8F7',
          desc_treinamento: 'Treinamento desenvolvimento web básico',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0002',
          nome_treinamento: 'Treinamento 2',
          cor: '#00B37E',
          desc_treinamento: 'Treinamento desenvolvimento backend em javascript',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0003',
          nome_treinamento: 'Treinamento 3',
          cor: '#F3F4F6',
          desc_treinamento: 'Treinamento desenvolvimento mobile',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0004',
          nome_treinamento: 'Treinamento 4',
          cor: '#F75A68',
          desc_treinamento: 'Treinamento full stack PHP',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_treinamento: '0005',
          nome_treinamento: 'Treinamento 5',
          cor: '#633BBC',
          desc_treinamento: 'Treinamento desenvolvimento frontend avançado',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],

      {},
    );

    for (let i = 10; i < 20; i++) {
      await queryInterface.bulkInsert(
        'treinamentos',
        [
          {
            cod_treinamento: `00${i}`,
            nome_treinamento: faker.music.songName(),
            cor: faker.helpers.arrayElement(['#81D8F7', '#00B37E', '#F75A68', '#F3F4F6', '#633BBC']),
            desc_treinamento: faker.commerce.productDescription(),
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],

        {},
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('treinamentos', null, {});
  },
};
