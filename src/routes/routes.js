/* eslint-disable max-len */
import { Router } from 'express';

// MIDDLEWARES
// import loginRequired from '../middlewares/loginRequired';

// CONTROLLERS
import tokenController from '../controllers/TokenController';
import usuarioController from '../controllers/UsuarioController';
import cursoController from '../controllers/CursoController';
import videoController from '../controllers/VideoController';
import treinamentoController from '../controllers/TreinamentoController';
import comentarioController from '../controllers/ComentarioController';
// import treinamentoUsuarioController from '../controllers/TreinamentoUsuarioController';
// import treinamentoCursoController from '../controllers/TreinamentoCursoController';
import cursoVideoController from '../controllers/CursoVideoController';

const router = new Router();

// TOKEN
router.post('/tokens', tokenController.store);
router.post('/send-reset-password/:cpf', tokenController.resetPassword);

// USUÁRIOS
router.get('/usuarios/', usuarioController.index);
router.get('/usuarios/:id', usuarioController.show);
router.get('/usuarios/search/:search', usuarioController.search);
router.post('/usuarios/', usuarioController.store);
router.put('/usuarios/:id', usuarioController.update);
router.delete('/usuarios/:id', usuarioController.destroy);

router.get('/usuarios-videos/:cpf', usuarioController.getVideos);
router.put('/usuarios-videos/:cpf/:codVideo', usuarioController.updateVideo);

// CURSOS
router.get('/cursos/', cursoController.index);
router.get('/cursos/:id', cursoController.show);
router.get('/cursos/search/:search', cursoController.search);
router.get('/cursos/get-by-video/:id', cursoController.getByVideo);
router.post('/cursos/', cursoController.store);
router.put('/cursos/:id', cursoController.update);
router.delete('/cursos/:id', cursoController.destroy);

// VIDEOS
router.get('/videos/', videoController.index);
router.get('/videos/:id', videoController.show);
router.get('/videos/get-by-curso/:id', videoController.getByCurso);
router.get('/videos/search/:search', videoController.search);
router.post('/videos/', videoController.store);
router.put('/videos/:id', videoController.update);
router.delete('/videos/:id', videoController.destroy);

// CURSO-VIDEO
// router.get('/curso-video/', cursoVideoController.index);
// router.get('/curso-video/cursos', cursoVideoController.getCursos);
// router.get('/curso-video/videos', cursoVideoController.getVideos);
router.get('/curso-video/:cod_curso/:cod_video', cursoVideoController.show);

// TREINAMENTOS
router.get('/treinamentos/', treinamentoController.index);
router.get('/treinamentos/:id', treinamentoController.show);
router.get('/treinamentos/search/:search', treinamentoController.search);
router.post('/treinamentos/', treinamentoController.store);
router.put('/treinamentos/:id', treinamentoController.update);
router.delete('/treinamentos/:id', treinamentoController.destroy);

// COMENTARIOS
router.get('/comentarios/', comentarioController.index);
router.get('/comentarios/:id', comentarioController.show);
router.post('/comentarios/', comentarioController.store);
router.put('/comentarios/:id', comentarioController.update);
router.delete('/comentarios/:id', comentarioController.destroy);

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

export default router;
