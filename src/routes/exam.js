import express from 'express';
import ExamController from '../app/controllers/ExamController';

const router = new express.Router();

router.post('/exams', ExamController.store);

router.get('/exams', ExamController.index);

router.get('/exams/:id', ExamController.show);

router.put('/exams/:id', ExamController.update);

router.delete('/exams/:id', ExamController.destroy);

export default router;
