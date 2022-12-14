/* eslint-disable max-len */
import { Router } from 'express';

// MIDDLEWARES
import loginRequired from '../middlewares/loginRequired';

// CONTROLLERS
import tokenController from '../controllers/TokenController';
import usuarioController from '../controllers/UsuarioController';
import cursoController from '../controllers/CursoController';
import videoController from '../controllers/VideoController';
import treinamentoController from '../controllers/TreinamentoController';
import comentarioController from '../controllers/ComentarioController';
import relatorioController from '../controllers/RelatorioController';
import notificacaoController from '../controllers/NotificacoesController';
// import treinamentoUsuarioController from '../controllers/TreinamentoUsuarioController';
// import treinamentoCursoController from '../controllers/TreinamentoCursoController';
// import cursoVideoController from '../controllers/CursoVideoController';

const router = new Router();

// TOKEN
router.post('/tokens', tokenController.store);
router.post('/send-reset-password/:cpf', tokenController.resetPassword);

// USUÁRIOS
router.get('/usuarios/', loginRequired, usuarioController.index);
router.get('/usuarios/:id', loginRequired, usuarioController.show);
router.get('/usuarios/search/:search', loginRequired, usuarioController.search);
router.get('/usuarios/get-cursos/:id', loginRequired, usuarioController.getCursos);
router.get('/usuarios/get-treinamentos/:id', loginRequired, usuarioController.getTreinamentos);
router.get('/usuarios-videos/:cpf/:cod_curso', loginRequired, usuarioController.getVideos);
router.post('/usuarios/', loginRequired, usuarioController.store);
router.put('/usuarios/:id', loginRequired, usuarioController.update);
router.put('/usuarios/activate/:id', loginRequired, usuarioController.activate);
router.delete('/usuarios/:id', loginRequired, usuarioController.destroy);
router.put('/usuarios-videos/:cpf/:cod_curso/:cod_video', loginRequired, usuarioController.updateVideo);

// CURSOS
router.get('/cursos/', loginRequired, cursoController.index);
router.get('/cursos/:id', loginRequired, cursoController.show);
router.get('/cursos/search/:search', loginRequired, cursoController.search);
router.get('/cursos/get-videos/:id', loginRequired, cursoController.getVideos);
router.post('/cursos/', loginRequired, cursoController.store);
router.put('/cursos/:id', loginRequired, cursoController.update);
router.put('/cursos/activate/:id', loginRequired, cursoController.activate);
router.delete('/cursos/:id', loginRequired, cursoController.destroy);

// VIDEOS
router.get('/videos/', loginRequired, videoController.index);
router.get('/videos/:id', loginRequired, videoController.show);
router.get('/videos/get-cursos/:id', loginRequired, videoController.getCursos);
router.get('/videos/get-by-curso/:cod_curso/:cod_video', loginRequired, videoController.getByCurso);
router.get('/videos/search/:search', loginRequired, videoController.search);
router.post('/videos/', loginRequired, videoController.store);
router.put('/videos/:id', loginRequired, videoController.update);
router.put('/videos/activate/:id', loginRequired, videoController.activate);
router.delete('/videos/:id', loginRequired, videoController.destroy);

// CURSO-VIDEO
// router.get('/curso-video/:cod_curso/:cod_video', loginRequired, cursoVideoController.show);

// TREINAMENTOS
router.get('/treinamentos/', loginRequired, treinamentoController.index);
router.get('/treinamentos/:id', loginRequired, treinamentoController.show);
router.get('/treinamentos/search/:search', loginRequired, treinamentoController.search);
router.get('/treinamentos/get-cursos-usuario/:id/:cpf', loginRequired, treinamentoController.getCursosDoUsuario);
router.post('/treinamentos/', loginRequired, treinamentoController.store);
router.put('/treinamentos/:id', loginRequired, treinamentoController.update);
router.put('/treinamentos/activate/:id', loginRequired, treinamentoController.activate);
router.delete('/treinamentos/:id', loginRequired, treinamentoController.destroy);

// COMENTARIOS
router.get('/comentarios/', loginRequired, comentarioController.index);
router.get('/comentarios/:id', loginRequired, comentarioController.show);
router.get('/comentarios/search/:search', loginRequired, comentarioController.search);
router.post('/comentarios/', loginRequired, comentarioController.store);
router.put('/comentarios/:id', loginRequired, comentarioController.update);
router.put('/comentarios/resolvido/:id', loginRequired, comentarioController.resolve);
router.delete('/comentarios/:id', loginRequired, comentarioController.destroy);

router.get('/comentarios/root/:cod_video', loginRequired, comentarioController.getRootComments);
router.get('/comentarios/repplyes/:cod_comentario', loginRequired, comentarioController.getRepplyes);

router.get('/relatorios/cursos', loginRequired, relatorioController.cursos);
router.get('/relatorios/videos', loginRequired, relatorioController.videos);
router.get('/relatorios/treinamento/:id', loginRequired, relatorioController.treinamento);
router.get('/relatorios/usuario-treinamentos/:id', loginRequired, relatorioController.usuarioTreinamentos);
router.get('/relatorios/usuario-cursos/:id', loginRequired, relatorioController.usuarioCursos);

router.get('/notificacoes/get-by-user/:id', loginRequired, notificacaoController.getByUser);

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
