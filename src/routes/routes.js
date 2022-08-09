import { Router } from 'express';

import homeController from '../controllers/HomeController';
import usuarioController from '../controllers/UsuarioController';

const router = new Router();

router.get('/', homeController.index);

export default router;
