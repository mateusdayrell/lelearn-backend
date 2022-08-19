import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
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
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.app.use('/', routes);
  }
}

export default new App().app;
