/* eslint-disable no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'cursos',
      [
        {
          cod_curso: '0001',
          nome_curso: 'Desenvolvimento web básico',
          desc_curso: 'Neste curso você vai aprender tudo aquilo que é necessário para iniciar no desenvolvimento web, mesmo sem nenhum conhecimento prévio na área.',
          nome_arquivo: '1664570936837_1209.jpg',
          videos_qtd: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_curso: '0002',
          nome_curso: 'Curso completo NodeJS',
          desc_curso: 'Neste curso você vai aprender a criar aplicações utilizando o NodeJS na prática.',
          nome_arquivo: '1664570936837_1209.jpg',
          videos_qtd: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_curso: '0003',
          nome_curso: 'Curso React Native',
          desc_curso: 'Neste curso você vai aprender a criar aplicações mobile tanto para Android quanto IOS através utilizando o React Native.',
          nome_arquivo: '1664570936837_1209.jpg',
          videos_qtd: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_curso: '0004',
          nome_curso: 'Curso Laravel',
          desc_curso: 'Neste curso você vai aprender todos os fundamentos do Laravel, além de construir um projeto prático utilizando esse framework.',
          nome_arquivo: '1664570936837_1209.jpg',
          videos_qtd: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_curso: '0005',
          nome_curso: 'Curso CSS avançado',
          desc_curso: 'Neste curso você aprenderá técnicas avançadas do CSS.',
          nome_arquivo: '1664570936837_1209.jpg',
          videos_qtd: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],

      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cursos', null, {});
  },
};
