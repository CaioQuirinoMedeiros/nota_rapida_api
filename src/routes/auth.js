import express from 'express';
import auth from '../app/middlewares/auth';
import AuthController from '../app/controllers/AuthController';

const router = new express.Router();

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.post('/logout', auth, AuthController.logout);

router.post('/logoutAll', auth, AuthController.logoutAll);

export default router;
