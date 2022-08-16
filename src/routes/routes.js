import { Router } from 'express';

// MIDDLEWARES
import loginRequired from '../middlewares/loginRequired';

// CONTROLLERS
import tokenController from '../controllers/TokenController';
import homeController from '../controllers/HomeController';
import usuarioController from '../controllers/UsuarioController';
import cursoController from '../controllers/CursoController';
import videoController from '../controllers/VideoController';
import treinamentoController from '../controllers/TreinamentoController';
import comentarioController  from '../controllers/ComentarioController';

const router = new Router();

// HOME
router.get('/home', homeController.index);

// TOKEN
router.post('/tokens', tokenController.store);

// USUÁRIOS
router.get('/usuarios/', loginRequired, usuarioController.index);
router.get('/usuarios/:id', usuarioController.show);
router.post('/usuarios/', usuarioController.store);
router.put('/usuarios/:id', usuarioController.update);
router.delete('/usuarios/:id', usuarioController.destroy);

// CURSOS
router.get('/cursos/', cursoController.index);
router.get('/cursos/:id', cursoController.show);
router.post('/cursos/', cursoController.store);
router.put('/cursos/:id', cursoController.update);
router.delete('/cursos/:id', cursoController.destroy);

// VIDEOS
router.get('/videos/', videoController.index);
router.get('/videos/:id', videoController.show);
router.post('/videos/', videoController.store);
router.put('/videos/:id', videoController.update);
router.delete('/videos/:id', videoController.destroy);

// TREINAMENTOS
router.get('/treinamentos/', treinamentoController.index);
router.get('/treinamentos/:id', treinamentoController.show);
router.post('/treinamentos/', treinamentoController.store);
router.put('/treinamentos/:id', treinamentoController.update);
router.delete('/treinamentos/:id', treinamentoController.destroy);

// COMENTARIOS
router.get('/comentarios/', comentarioController.index);
router.get('/comentarios/:id', comentarioController.show);
router.post('/comentarios/', comentarioController.store);
router.put('/comentarios/:id', comentarioController.update);
router.delete('/comentarios/:id', comentarioController.destroy);

export default router;
