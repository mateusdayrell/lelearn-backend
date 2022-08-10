import { Router } from 'express';

// MIDDLEWARES
import loginRequired from '../middlewares/loginRequired';

// CONTROLLERS
import homeController from '../controllers/HomeController';
import usuarioController from '../controllers/UsuarioController';
import tokenController from '../controllers/TokenController';

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

export default router;
