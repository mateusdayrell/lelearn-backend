const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
// const delay = require('express-delay');
const { resolve } = require('path');
const routes = require('./routes/routes');
require('./database/connection'); // connect to database;

dotenv.config();

const whiteList = [
  // 'loacalhost:3000',
  'https://a361-177-101-41-201.sa.ngrok.io',
  'https://a361-177-101-41-201.sa.ngrok.io/',
  // 'https://48dc-138-99-191-36.sa.ngrok.io/',
  // 'https://48dc-138-99-191-36.sa.ngrok.io',
];

const corsOptions = {
  // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // preflightContinue: false,
  // optionsSuccessStatus: 204,
  // headers: {"Access-Control-Allow-Origin": "*"},
  // credentials: true,
  // crossorigin:true,
  // headers: [{"Access-Control-Allow-Origin": "*"}],
  headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
  origin: (origin, calback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      calback(null, true);
      console.log('FOI');
    } else {
      calback(new Error('Não permitido pelo CORS.'));
    }
  },
};

class App {
  constructor() {
    this.app = express();

    this.app.use((req, res, next) => {
      // req.setHeader("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Origin', '*');
      next();
    });

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // this.app.use(cors(corsOptions));
    // this.app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
    this.app.use(cors(corsOptions));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(resolve(__dirname, '..', 'uploads')));
    // this.app.use(delay(2000));
  }

  routes() {
    this.app.use('/', routes);
  }
}

module.exports = new App().app;
