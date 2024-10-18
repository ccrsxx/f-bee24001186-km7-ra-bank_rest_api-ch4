import express, { Router } from 'express';
import root from './root.js';
import users from './users.js';
import accounts from './accounts.js';
import transactions from './transactions.js';

/** @param {express.Express} app */
export default (app) => {
  const appRouter = Router();

  app.use('/api/v1', appRouter);

  root(appRouter);
  users(appRouter);
  accounts(appRouter);
  transactions(appRouter);
};
