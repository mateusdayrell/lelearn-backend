/* eslint-disable no-unused-vars */
const { faker } = require('@faker-js/faker/locale/pt_BR');

module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 10; i < 61; i++) {
      await queryInterface.bulkInsert(
        'videos',
        [
          {
            cod_video: `00${i}`,
            cod_curso: faker.helpers.arrayElement(['0001', '0002', '0003', '0004', '0005']),
            titulo_video: faker.music.songName(),
            desc_video: faker.commerce.productDescription(),
            link: 'https://www.youtube.com/embed/tgbNymZ7vqY',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],

        {},
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('videos', null, {});
  },
};
