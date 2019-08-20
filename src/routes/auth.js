import express from 'express';

import AuthController from '../app/controllers/AuthController';

import validateUserStore from '../app/validators/UserStore';

const router = new express.Router();

router.post('/register', validateUserStore, AuthController.register);

router.post('/login', AuthController.login);

export default router;
