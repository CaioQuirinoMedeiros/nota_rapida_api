import express from 'express';

import TemplateController from '../app/controllers/TemplateController';
import auth from '../app/middlewares/auth';

import validaeTemplateStore from '../app/validators/TemplateStore';
import validaeTemplateUpdate from '../app/validators/TemplateUpdate';

const router = new express.Router();

router.use(auth);

router.post('/templates', validaeTemplateStore, TemplateController.store);

router.get('/templates', TemplateController.index);

router.get('/templates/:id', TemplateController.show);

router.put('/templates/:id', validaeTemplateUpdate, TemplateController.update);

router.delete('/templates/:id', TemplateController.destroy);

export default router;
