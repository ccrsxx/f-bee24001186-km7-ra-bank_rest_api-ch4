import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { UserValidationMiddleware } from '../middlewares/validation/user.js';
import { CommonValidationMiddleware } from '../middlewares/validation/common.js';

/** @param {Router} appRouter */
export default (appRouter) => {
  const router = Router();

  appRouter.use('/users', router);

  router.get('/', UserController.getUsers);

  router.post(
    '/',
    UserValidationMiddleware.isValidUserPayload,
    UserController.createUser
  );

  router.get(
    '/:id',
    CommonValidationMiddleware.isValidParamsIdUuid,
    UserController.getUser
  );
};
