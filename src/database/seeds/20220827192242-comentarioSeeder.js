/* eslint-disable no-unused-vars */
const { faker } = require('@faker-js/faker/locale/pt_BR');
const usuarioHelper = require('../../helpers/UsuarioHelper');

module.exports = {
  async up(queryInterface, Sequelize) {
    for (let c = 10; c < 21; c++) { // comentários
      for (let v = 10; v < 61; v++) { // videos
        const codComentario = `${c}${v}`;
        const codVideo = `00${v}`;

        await queryInterface.bulkInsert(
          'comentarios',
          [
            {
              cod_comentario: codComentario,
              cpf: faker.helpers.arrayElement(usuarioHelper.staticCpfs),
              cod_video: codVideo,
              comentario_pai: faker.helpers.arrayElement([codComentario, null]),
              texto: faker.helpers.arrayElement([faker.lorem.sentence(), faker.lorem.paragraphs()]),
              created_at: new Date(),
              updated_at: new Date(),
            },
          ],
          {},
        );
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comentarios', null, {});
  },
};
