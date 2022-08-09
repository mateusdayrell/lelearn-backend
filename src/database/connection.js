import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Treinamento from '../models/Treinamento';

const models = [Treinamento];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
