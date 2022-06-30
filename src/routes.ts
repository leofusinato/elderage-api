import { Router } from 'express';
import authMiddleware from './app/middlewares/authMiddleware';

import UserController from './app/controllers/UserController';
import AuthController from './app/controllers/AuthController';
import AgedController from './app/controllers/AgedController';
import AgedContactController from './app/controllers/AgedContactController';
import AgedMedicationController from './app/controllers/AgedMedicationController';
import InviteController from './app/controllers/InviteController';
import CheckinMedicationController from './app/controllers/CheckinMedicationController';
import AnamnesisController from './app/controllers/AnamnesisController';
import AgedEventController from './app/controllers/AgedEventController';

const router = Router();

//No auth routes
router.post('/users', UserController.store);
router.post('/login', AuthController.authenticate);
router.post('/forgotPassword', AuthController.forgotPassword);
router.post('/resetPassword', AuthController.resetPassword);
router.post('/refreshToken', AuthController.refreshToken);

//Auth routes
router.get('/users', authMiddleware, UserController.list);
router.get('/aged', authMiddleware, AgedController.list);
router.get('/aged/:aged_id', authMiddleware, AgedController.index);
router.post('/aged', authMiddleware, AgedController.store);
router.delete('/aged/:aged_id', authMiddleware, AgedController.delete);
router.put('/aged/:aged_id', authMiddleware, AgedController.update);
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
router.put(
  '/aged/:aged_id/contact/:contact_id',
  authMiddleware,
  AgedContactController.update
);
router.delete(
  '/aged/:aged_id/contact/:contact_id',
  authMiddleware,
  AgedContactController.delete
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
router.put(
  '/aged/:aged_id/medication/:medication_id',
  authMiddleware,
  AgedMedicationController.update
);
router.delete(
  '/aged/:aged_id/medication/:medication_id',
  authMiddleware,
  AgedMedicationController.delete
);

router.post('/checkin', authMiddleware, CheckinMedicationController.store);
router.get(
  '/checkin/medication/:medication_id',
  authMiddleware,
  CheckinMedicationController.indexFromMedication
);
router.get(
  '/checkin/user',
  authMiddleware,
  CheckinMedicationController.indexFromUser
);
router.get(
  '/checkin/aged/:aged_id',
  authMiddleware,
  CheckinMedicationController.indexFromAged
);

router.get('/invite/my', authMiddleware, InviteController.my);
router.get('/invite/guest', authMiddleware, InviteController.guest);
router.post('/invite', authMiddleware, InviteController.store);
router.patch(
  '/invite/:invite_id/accept',
  authMiddleware,
  InviteController.accept
);
router.patch(
  '/invite/:invite_id/decline',
  authMiddleware,
  InviteController.decline
);

router.post('/anamnesis', authMiddleware, AnamnesisController.store);
router.put(
  '/anamnesis/:anamnesisId',
  authMiddleware,
  AnamnesisController.update
);
router.delete(
  '/anamnesis/:anamnesisId',
  authMiddleware,
  AnamnesisController.delete
);
router.get(
  '/anamnesis/aged/:agedId',
  authMiddleware,
  AnamnesisController.indexFromAged
);
router.get(
  '/anamnesis/:anamnesisId',
  authMiddleware,
  AnamnesisController.index
);

router.post('/agedEvent', authMiddleware, AgedEventController.store);
router.get(
  '/agedEvent/aged/:agedId',
  authMiddleware,
  AgedEventController.indexFromAged
);
router.get('/agedEvent/:eventId', authMiddleware, AgedEventController.index);
router.put('/agedEvent/:eventId', authMiddleware, AgedEventController.update);
router.delete(
  '/agedEvent/:eventId',
  authMiddleware,
  AgedEventController.delete
);

export default router;
