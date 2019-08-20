import express from 'express';

import UserController from '../app/controllers/UserController';
import auth from '../app/middlewares/auth';

import validateUserUpdate from '../app/validators/UserUpdate';

const router = new express.Router();

router.use(auth);

router.get('/me', UserController.show);

router.put('/me', validateUserUpdate, UserController.update);

router.delete('/me', UserController.delete);

export default router;
