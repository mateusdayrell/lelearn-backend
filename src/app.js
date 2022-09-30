import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
// import delay from 'express-delay';
import { resolve } from 'path';
import routes from './routes/routes';
import './database/connection'; // connect to database;

dotenv.config();

const whiteList = [
  'http://localhost:3000',
];

const corsOptions = {
  origin: (origin, calback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      calback(null, true);
    } else {
      calback(new Error('Não permitido pelo CORS.'));
    }
  },
};

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors(corsOptions));
    this.app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(resolve(__dirname, '..', 'uploads')));
    // this.app.use(delay(2000));
  }

  routes() {
    this.app.use('/', routes);
  }
}

export default new App().app;
