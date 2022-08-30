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
import treinamentoUsuarioController from '../controllers/TreinamentoUsuarioController';
import treinamentoCursoController from '../controllers/TreinamentoCursoController';

const router = new Router();

// TOKEN
router.post('/tokens', tokenController.store);

// USUÁRIOS
router.get('/usuarios/', loginRequired, usuarioController.index);
router.get('/usuarios/:id', usuarioController.show);
router.get('/usuarios/search/:search', usuarioController.search);
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

// TREINAMENTOS-USUARIOS
router.get('/treinamentos-usuarios/', treinamentoUsuarioController.index);
router.get('/treinamentos-usuarios/:cod_treinamento/:cpf', treinamentoUsuarioController.show);
router.post('/treinamentos-usuarios/', treinamentoUsuarioController.store);
router.put('/treinamentos-usuarios/:cod_treinamento/:cpf', treinamentoUsuarioController.update);
router.delete('/treinamentos-usuarios/:cod_treinamento/:cpf', treinamentoUsuarioController.destroy);

// TREINAMENTOS-CURSOS
router.get('/treinamentos-cursos/', treinamentoCursoController.index);
router.get('/treinamentos-cursos/:cod_treinamento/:cod_curso', treinamentoCursoController.show);
router.post('/treinamentos-cursos/', treinamentoCursoController.store);
router.put('/treinamentos-cursos/:cod_treinamento/:cod_curso', treinamentoCursoController.update);
router.delete('/treinamentos-cursos/:cod_treinamento/:cod_curso', treinamentoCursoController.destroy);

export default router;
