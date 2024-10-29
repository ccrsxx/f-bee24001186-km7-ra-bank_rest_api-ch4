import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.js';
import { AccountController } from '../controllers/account.js';
import { CommonValidationMiddleware } from '../middlewares/validation/common.js';
import { AccountValidationMiddleware } from '../middlewares/validation/account.js';
import { AccountMiddleware } from '../middlewares/account.js';

/** @param {Router} appRouter */
export default (appRouter) => {
  const router = Router();

  appRouter.use('/accounts', router);

  router.get('/', AccountController.getAccounts);

  router.post(
    '/',
    AuthMiddleware.isAuthorized,
    AccountValidationMiddleware.isValidAccountPayload,
    AccountController.createAccount
  );

  router.get(
    '/:id',
    CommonValidationMiddleware.isValidParamsIdUuid,
    AccountController.getAccount
  );

  router.post(
    '/:id/withdraw',
    AuthMiddleware.isAuthorized,
    CommonValidationMiddleware.isValidParamsIdUuid,
    AccountMiddleware.isAccountBelongsToUser,
    AccountValidationMiddleware.isValidAmountPayload,
    AccountController.withdrawAccount
  );

  router.post(
    '/:id/deposit',
    AuthMiddleware.isAuthorized,
    CommonValidationMiddleware.isValidParamsIdUuid,
    AccountMiddleware.isAccountBelongsToUser,
    AccountValidationMiddleware.isValidAmountPayload,
    AccountController.depositAccount
  );
};
