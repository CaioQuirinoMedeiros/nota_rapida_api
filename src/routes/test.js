import express from 'express';
import TestController from '../app/controllers/TestController';
import auth from '../app/middlewares/auth';

const router = new express.Router();

router.use(auth);

router.post('/tests', TestController.store);

router.get('/tests', TestController.index);

router.get('/tests/:id', TestController.show);

export default router;
