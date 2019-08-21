import express from 'express';

import StudentController from '../app/controllers/StudentController';

import validateStudentStore from '../app/validators/StudentStore';
import validateStudentUpdate from '../app/validators/StudentUpdate';

const router = new express.Router();

router.post('/students', validateStudentStore, StudentController.store);

router.get('/students', StudentController.index);

router.get('/students/:id', StudentController.show);

router.put('/students/:id', validateStudentUpdate, StudentController.update);

router.delete('/students/:id', StudentController.destroy);

export default router;
