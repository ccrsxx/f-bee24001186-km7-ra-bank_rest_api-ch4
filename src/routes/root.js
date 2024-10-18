import { Router } from 'express';

/**
 * @param {Router} appRouter
 */
export default (appRouter) => {
  const router = Router();

  appRouter.use('/', router);

  router.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello, world!' });
  });
};
