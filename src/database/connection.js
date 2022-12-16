const Sequelize = require('sequelize');
const databaseConfig = require('../config/database');
const Treinamento = require('../models/Treinamento');
const Usuario = require('../models/Usuario');
const Curso = require('../models/Curso');
const Video = require('../models/Video');
const Comentario = require('../models/Comentario');
const TreinamentoUsuario = require('../models/TreinamentoUsuario');
const TreinamentoCurso = require('../models/TreinamentoCurso');
const UsuarioVideo = require('../models/UsuarioVideo');
const CursoVideo = require('../models/CursoVideo');
const Notificacao = require('../models/Notificacao');

const models = [
  Treinamento, Usuario, Curso, Video, Comentario, TreinamentoUsuario, TreinamentoCurso,
  UsuarioVideo, CursoVideo, Notificacao,
];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));
