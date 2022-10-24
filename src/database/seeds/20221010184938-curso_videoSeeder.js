/* eslint-disable no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 1; i <= 6; i++) {
      await queryInterface.bulkInsert(
        'cursos_videos',
        [
          {
            cod_curso: '0001',
            cod_video: `001${i}`,
            ordem: `${i}`,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            cod_curso: '0002',
            cod_video: `001${i}`,
            ordem: `${i}`,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            cod_curso: '0003',
            cod_video: `001${i}`,
            ordem: `${i}`,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            cod_curso: '0004',
            cod_video: `001${i}`,
            ordem: `${i}`,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            cod_curso: '0005',
            cod_video: `001${i}`,
            ordem: `${i}`,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],

        {},
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cursos_videos', null, {});
  },
};
