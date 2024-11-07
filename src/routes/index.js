import { Router } from 'express';
import root from './root.js';
import auth from './auth.js';
import docs from './docs.js';
import users from './users.js';
import upload from './upload.js';
import accounts from './accounts.js';
import transactions from './transactions.js';

/** @import {Application} from 'express' */

/** @param {Application} app */
export default (app) => {
  const appRouter = Router();

  app.use('/api/v1', appRouter);

  root(appRouter);
  auth(appRouter);
  docs(appRouter);
  users(appRouter);
  upload(appRouter);
  accounts(appRouter);
  transactions(appRouter);
};
