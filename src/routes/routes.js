/* eslint-disable max-len */
// MIDDLEWARES
const express = require('express');
const loginRequired = require('../middlewares/loginRequired');

// CONTROLLERS
const tokenController = require('../controllers/TokenController');
const usuarioController = require('../controllers/UsuarioController');
const cursoController = require('../controllers/CursoController');
const videoController = require('../controllers/VideoController');
const treinamentoController = require('../controllers/TreinamentoController');
const comentarioController = require('../controllers/ComentarioController');
const relatorioController = require('../controllers/RelatorioController');
const notificacaoController = require('../controllers/NotificacoesController');

const router = express.Router();

// import treinamentoUsuarioController from '../controllers/TreinamentoUsuarioController';
// import treinamentoCursoController from '../controllers/TreinamentoCursoController';
// import cursoVideoController from '../controllers/CursoVideoController';

// TOKEN
router.post('/tokens', tokenController.store);
router.post('/send-reset-password/:cpf', tokenController.resetPassword);

router.get('/', usuarioController.index);

// USUÁRIOS
router.get('/usuarios/', usuarioController.index);
router.get('/usuarios/:id', usuarioController.show);
router.get('/usuarios/search/:search', usuarioController.search);
router.get('/usuarios/get-cursos/:id', usuarioController.getCursos);
router.get('/usuarios/get-treinamentos/:id', usuarioController.getTreinamentos);
router.get('/usuarios-videos/:cpf/:cod_curso', usuarioController.getVideos);
router.post('/usuarios/', usuarioController.store);
router.put('/usuarios/:id', usuarioController.update);
router.put('/usuarios/activate/:id', usuarioController.activate);
router.delete('/usuarios/:id', usuarioController.destroy);
router.put('/usuarios-videos/:cpf/:cod_curso/:cod_video', usuarioController.updateVideo);

// CURSOS
router.get('/cursos/', cursoController.index);
router.get('/cursos/:id', cursoController.show);
router.get('/cursos/search/:search', cursoController.search);
router.get('/cursos/get-videos/:id', cursoController.getVideos);
router.post('/cursos/', cursoController.store);
router.put('/cursos/:id', cursoController.update);
router.put('/cursos/activate/:id', cursoController.activate);
router.delete('/cursos/:id', cursoController.destroy);

// VIDEOS
router.get('/videos/', videoController.index);
router.get('/videos/:id', videoController.show);
router.get('/videos/get-cursos/:id', videoController.getCursos);
router.get('/videos/get-by-curso/:cod_curso/:cod_video', videoController.getByCurso);
router.get('/videos/search/:search', videoController.search);
router.post('/videos/', videoController.store);
router.put('/videos/:id', videoController.update);
router.put('/videos/activate/:id', videoController.activate);
router.delete('/videos/:id', videoController.destroy);

// CURSO-VIDEO
// router.get('/curso-video/:cod_curso/:cod_video', cursoVideoController.show);

// TREINAMENTOS
router.get('/treinamentos/', treinamentoController.index);
router.get('/treinamentos/:id', treinamentoController.show);
router.get('/treinamentos/search/:search', treinamentoController.search);
router.get('/treinamentos/get-cursos-usuario/:id/:cpf', treinamentoController.getCursosDoUsuario);
router.post('/treinamentos/', treinamentoController.store);
router.put('/treinamentos/:id', treinamentoController.update);
router.put('/treinamentos/activate/:id', treinamentoController.activate);
router.delete('/treinamentos/:id', treinamentoController.destroy);

// COMENTARIOS
router.get('/comentarios/', comentarioController.index);
router.get('/comentarios/:id', comentarioController.show);
router.get('/comentarios/search/:search', comentarioController.search);
router.post('/comentarios/', comentarioController.store);
router.put('/comentarios/:id', comentarioController.update);
router.put('/comentarios/resolvido/:id', comentarioController.resolve);
router.delete('/comentarios/:id', comentarioController.destroy);

router.get('/comentarios/root/:cod_video', comentarioController.getRootComments);
router.get('/comentarios/repplyes/:cod_comentario', comentarioController.getRepplyes);

router.get('/relatorios/cursos', relatorioController.cursos);
router.get('/relatorios/videos', relatorioController.videos);
router.get('/relatorios/treinamento/:id', relatorioController.treinamento);
router.get('/relatorios/usuario-treinamentos/:id', relatorioController.usuarioTreinamentos);
router.get('/relatorios/usuario-cursos/:id', relatorioController.usuarioCursos);

router.get('/notificacoes/get-by-user/:id', notificacaoController.getByUser);

// TREINAMENTOS-USUARIOS
// router.get('/treinamentos-usuarios/', treinamentoUsuarioController.index);
// router.get('/treinamentos-usuarios/:cod_treinamento/:cpf', treinamentoUsuarioController.show);
// router.post('/treinamentos-usuarios/', treinamentoUsuarioController.store);
// router.put('/treinamentos-usuarios/:cod_treinamento/:cpf', treinamentoUsuarioController.update);
// router.delete('/treinamentos-usuarios/:cod_treinamento/:cpf', treinamentoUsuarioController.destroy);

// TREINAMENTOS-CURSOS
// router.get('/treinamentos-cursos/', treinamentoCursoController.index);
// router.get('/treinamentos-cursos/:cod_treinamento/:cod_curso', treinamentoCursoController.show);
// router.post('/treinamentos-cursos/', treinamentoCursoController.store);
// router.put('/treinamentos-cursos/:cod_treinamento/:cod_curso', treinamentoCursoController.update);
// router.delete('/treinamentos-cursos/:cod_treinamento/:cod_curso', treinamentoCursoController.destroy);

module.exports = router;
