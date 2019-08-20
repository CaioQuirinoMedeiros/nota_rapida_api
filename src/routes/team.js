import express from 'express';
import TeamController from '../app/controllers/TeamController';
import auth from '../app/middlewares/auth';

const router = new express.Router();

router.use(auth);

router.post('/teams', TeamController.store);

router.get('/teams', TeamController.index);

router.get('/teams/:id', TeamController.show);

router.put('/teams/:id', TeamController.update);

router.delete('/teams/:id', TeamController.destroy);

export default router;
