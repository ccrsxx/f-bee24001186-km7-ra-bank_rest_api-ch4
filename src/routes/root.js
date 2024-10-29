import { Router } from 'express';

/** @param {Router} appRouter */
export default (appRouter) => {
  const router = Router();

  appRouter.use('/', router);

  router.get('/', (_req, res) => {
    res.status(200).json({ message: 'Hello, World' });
  });
};
