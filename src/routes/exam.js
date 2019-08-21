import express from 'express';

import ExamController from '../app/controllers/ExamController';

import validateExamStore from '../app/validators/ExamStore';
import validateExamUpdate from '../app/validators/ExamUpdate';

const router = new express.Router();

router.post('/exams', validateExamStore, ExamController.store);

router.get('/exams', ExamController.index);

router.get('/exams/:id', ExamController.show);

router.put('/exams/:id', validateExamUpdate, ExamController.update);

router.delete('/exams/:id', ExamController.destroy);

export default router;
