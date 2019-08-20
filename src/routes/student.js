import express from 'express';
import StudentController from '../app/controllers/StudentController';

const router = new express.Router();

router.post('/students', StudentController.store);

router.get('/students', StudentController.index);

router.get('/students/:id', StudentController.show);

router.put('/students/:id', StudentController.update);

router.delete('/students/:id', StudentController.destroy);

export default router;
