import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Treinamento from '../models/Treinamento';
import Usuario from '../models/Usuario';

const models = [Treinamento, Usuario];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
