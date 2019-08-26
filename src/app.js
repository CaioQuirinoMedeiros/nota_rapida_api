import 'dotenv/config';
import cors from 'cors';
import Youch from 'youch';
import express from 'express';
import 'express-async-errors';

import authRouter from './routes/auth';
import userRouter from './routes/user';
import branchRouter from './routes/branch';
import teamRouter from './routes/team';
import studentRouter from './routes/student';
import templateRouter from './routes/template';
import examRouter from './routes/exam';
import testRouter from './routes/test';
import filesRouter from './routes/files';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  routes() {
    this.server.use(authRouter);
    this.server.use(userRouter);
    this.server.use(branchRouter);
    this.server.use(teamRouter);
    this.server.use(studentRouter);
    this.server.use(templateRouter);
    this.server.use(examRouter);
    this.server.use(testRouter);
    this.server.use(filesRouter);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Erro interno do servidor' });
    });
  }
}

export default new App().server;
