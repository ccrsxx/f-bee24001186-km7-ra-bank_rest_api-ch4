import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { CommonValidationMiddleware } from '../middlewares/validation/common.js';
import { AuthMiddleware } from '../middlewares/auth.js';
import { UserValidationMiddleware } from '../middlewares/validation/user.js';

/** @param {Router} appRouter */
export default (appRouter) => {
  const router = Router();

  appRouter.use('/users', router);

  router.get('/', UserController.getUsers);

  router.get('/me', AuthMiddleware.isAuthorized, UserController.getCurrentUser);

  router.get(
    '/:id',
    CommonValidationMiddleware.isValidParamsIdUuid,
    UserController.getUser
  );

  router.put(
    '/me/profile',
    AuthMiddleware.isAuthorized,
    UserValidationMiddleware.isValidUserProfilePayload,
    UserController.updateCurrentUserProfile
  );
};
