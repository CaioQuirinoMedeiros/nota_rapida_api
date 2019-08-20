import express from 'express';
import UserController from '../app/controllers/UserController';
import auth from '../app/middlewares/auth';

const router = new express.Router();

router.use(auth);

router.get('/me', UserController.show);

router.patch('/me', UserController.update);

router.delete('/me', UserController.delete);

export default router;
