import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';
import { UserValidationMiddleware } from '../middlewares/validation/user.js';
import { AuthValidationMiddleware } from '../middlewares/validation/auth.js';
import { CommonValidationMiddleware } from '../middlewares/validation/common.js';

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

  router.post(
    '/password-reset',
    CommonValidationMiddleware.isValidEmail,
    AuthController.sendPasswordResetEmail
  );

  router.put(
    '/password-reset',
    AuthValidationMiddleware.isValidResetPasswordPayload,
    AuthController.resetPassword
  );

  router.get(
    '/password-reset/:token',
    AuthValidationMiddleware.isValidTokenParams,
    AuthController.verifyPasswordResetToken
  );
};
