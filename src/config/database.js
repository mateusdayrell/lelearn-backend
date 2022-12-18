require('dotenv').config();

module.exports = {
  dialect: 'mysql',
  dialectModule: require('mysql2'), // eslint-disable-line
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  dialectOptoins: {
    useUTC: false, // for reading from database
    dateStrings: true,
    typeCast: true,
  },
  timezone: 'America/Sao_Paulo',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
