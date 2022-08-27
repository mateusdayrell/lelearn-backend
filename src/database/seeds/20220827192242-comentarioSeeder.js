module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'comentarios',
      [
        {
          cod_comentario: '0001',
          cpf: '00000000003',
          cod_video: '0001',
          comentario_pai: null,
          texto: 'Lorem ipsum dolor sit amet. Est nemo provident in laboriosam doloribus ea porro nobis qui doloribus eveniet',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_comentario: '0002',
          cpf: '00000000003',
          cod_video: '0002',
          comentario_pai: null,
          texto: 'doloribus eveniet qui natus voluptate ut ipsa numquam. Aut voluptates culpa ab dolore sapiente in nulla commodi ea quod dolores aut nihil voluptas',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_comentario: '0003',
          cpf: '00000000004',
          cod_video: '0001',
          comentario_pai: '0001',
          texto: 'Et doloremque sint et veniam consequuntur non harum eligendi hic enim fugiat ad exercitationem veritatis est necessitatibus',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_comentario: '0004',
          cpf: '00000000004',
          cod_video: '0003',
          comentario_pai: null,
          texto: 'Sit laudantium quas et sapiente quia ea odio quas eos harum voluptate?',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_comentario: '0005',
          cpf: '00000000005',
          cod_video: '0004',
          comentario_pai: '0002',
          texto: 'Aut temporibus rerum et minus sunt a nulla similique qui repellendus autem',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comentarios', null, {});
  },
};
