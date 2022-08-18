import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/routes';
import './database/connection'; // connect to database;

dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.app.use('/', routes);
  }
}

export default new App().app;
