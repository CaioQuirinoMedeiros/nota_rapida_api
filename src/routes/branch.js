import express from 'express';
import BranchController from '../app/controllers/BranchController';

const router = new express.Router();

router.post('/branches', BranchController.store);

router.get('/branches', BranchController.index);

router.get('/branches/:id', BranchController.show);

router.put('/branches/:id', BranchController.update);

router.delete('/branches/:id', BranchController.destroy);

export default router;
