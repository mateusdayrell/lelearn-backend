module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'videos',
      [
        {
          cod_video: '0001',
          cod_curso: '0001',
          titulo_video: 'O que é HTML?',
          desc_video: 'Nesse vídeo você vai aprender o que é o HTML.',
          link: 'https://wwww.lelearn/videos/0001.com.br',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_video: '0002',
          cod_curso: '0001',
          titulo_video: 'Tags Semânticas',
          desc_video: 'Nesse vídeo você irá aprender sobre tags semânticas.',
          link: 'https://wwww.lelearn/videos/0002.com.br',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_video: '0003',
          cod_curso: '0003',
          titulo_video: 'Introdução ao ReactNative',
          desc_video: 'Nesse vídeo você terá o primeiro contato com o ReactNative.',
          link: 'https://wwww.lelearn/videos/0003.com.br',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_video: '0004',
          cod_curso: '0002',
          titulo_video: 'Express no node',
          desc_video: 'Nesse vídeo você irá aprender sobre o framework Express.',
          link: 'https://wwww.lelearn/videos/0004.com.br',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          cod_video: '0005',
          cod_curso: '0005',
          titulo_video: 'Váriáveis em CSS',
          desc_video: 'Nesse vídeo você irá se aprofundar em váriaveis no css.',
          link: 'https://wwww.lelearn/videos/0005.com.br',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],

      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('videos', null, {});
  },
};
