import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';
import { UserValidationMiddleware } from '../middlewares/validation/user.js';
import { AuthValidationMiddleware } from '../middlewares/validation/auth.js';

/** @param {Router} appRouter */
export default (appRouter) => {
  const router = Router();

  appRouter.use('/auth', router);

  router.post(
    '/register',
    UserValidationMiddleware.isValidUserPayload,
    AuthController.register
  );

  router.post(
    '/login',
    AuthValidationMiddleware.isValidLoginPayload,
    AuthController.login
  );
};
