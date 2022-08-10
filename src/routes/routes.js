import { Router } from 'express';

import homeController from '../controllers/HomeController';
import usuarioController from '../controllers/UsuarioController';

const router = new Router();

router.get('/home', homeController.index);

// USUÁRIOS
router.get('/usuarios/', usuarioController.index);
router.get('/usuarios/:id', usuarioController.show);
router.post('/usuarios/', usuarioController.store);
router.put('/usuarios/:id', usuarioController.update);
router.delete('/usuarios/:id', usuarioController.destroy);

export default router;
