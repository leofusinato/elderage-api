import { Router } from 'express';
import authMiddleware from './app/middlewares/authMiddleware';

import UserController from './app/controllers/UserController';
import AuthController from './app/controllers/AuthController';
import AgedController from './app/controllers/AgedController';
import AgedContactController from './app/controllers/AgedContactController';

const router = Router();

//No auth routes
router.post('/users', UserController.store);

router.post('/login', AuthController.authenticate);
router.post('/forgotPassword', AuthController.forgotPassword);
router.post('/resetPassword', AuthController.resetPassword);

//Auth routes
router.get('/users', authMiddleware, UserController.list);
router.get('/aged', authMiddleware, AgedController.list);
router.post('/aged', authMiddleware, AgedController.store);
router.delete('/aged/:aged_id', authMiddleware, AgedController.delete);
router.get(
  '/aged/:aged_id/contact',
  authMiddleware,
  AgedContactController.listFromAged
);
router.post(
  '/aged/:aged_id/contact',
  authMiddleware,
  AgedContactController.store
);

export default router;
