/* eslint-disable no-unused-vars */
const { faker } = require('@faker-js/faker/locale/pt_BR');
const usuarioHelper = require('../../helpers/UsuarioHelper');

module.exports = {
  async up(queryInterface, Sequelize) {
    for (let c = 10; c < 13; c++) { // comentários
      for (let v = 10; v < 21; v++) { // videos
        const codComentario = `${c}${v}`;
        const codResposta = v > 10 ? `${c}${v - 1}` : null;
        const codVideo = `00${v}`;

        await queryInterface.bulkInsert(
          'comentarios',
          [
            {
              cod_comentario: codComentario,
              cpf: faker.helpers.arrayElement(usuarioHelper.staticCpfs),
              cod_video: codVideo,
              comentario_pai: faker.helpers.arrayElement([codResposta, null]),
              texto: faker.helpers.arrayElement([faker.lorem.sentence(), faker.lorem.paragraphs()]),
              resolvido: false,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ],
          {},
        );
      }
    }
    // for (let c = 10; c < 21; c++) { // comentários
    //   for (let v = 10; v < 41; v++) { // videos
    //     const codComentario = `${c}${v}`;
    //     const codVideo = `00${v}`;

    //     await queryInterface.bulkInsert(
    //       'comentarios',
    //       [
    //         {
    //           cod_comentario: codComentario,
    //           cpf: faker.helpers.arrayElement(usuarioHelper.staticCpfs),
    //           cod_video: codVideo,
    //           comentario_pai: faker.helpers.arrayElement([codComentario, null]),
    //           texto: faker.helpers.arrayElement([faker.lorem.sentence(), faker.lorem.paragraphs()]),
    //           resolvido: false,
    //           created_at: new Date(),
    //           updated_at: new Date(),
    //         },
    //       ],
    //       {},
    //     );
    //   }
    // }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comentarios', null, {});
  },
};
