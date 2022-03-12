import { Router } from 'express';
import authMiddleware from './app/middlewares/authMiddleware';

import UserController from './app/controllers/UserController';
import AuthController from './app/controllers/AuthController';
import AgedController from './app/controllers/AgedController';
import AgedContactController from './app/controllers/AgedContactController';
import AgedMedicationController from './app/controllers/AgedMedicationController';

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
router.post(
  '/aged/:aged_id/medication',
  authMiddleware,
  AgedMedicationController.store
);
router.get(
  '/aged/:aged_id/medication',
  authMiddleware,
  AgedMedicationController.list
);
router.delete(
  '/aged/:aged_id/medication/:medication_id',
  authMiddleware,
  AgedMedicationController.delete
);

export default router;
