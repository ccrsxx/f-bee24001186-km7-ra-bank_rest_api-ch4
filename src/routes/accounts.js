import { Router } from 'express';
import { AccountController } from '../controllers/accounts.js';
import { AccountValidationMiddleware } from '../middlewares/validation/account.js';
import { CommonValidationMiddleware } from '../middlewares/validation/common.js';

/** @param {Router} appRouter */
export default (appRouter) => {
  const router = Router();

  appRouter.use('/accounts', router);

  router.get('/', AccountController.getAccounts);

  router.post(
    '/',
    AccountValidationMiddleware.isValidAccountPayload,
    AccountController.createAccount
  );

  router.get(
    '/:id',
    CommonValidationMiddleware.isValidParamsIdUuid,
    AccountController.getAccount
  );

  router.get(
    '/:id/withdraw',
    CommonValidationMiddleware.isValidParamsIdUuid,
    AccountController.getAccount
  );

  router.get(
    '/:id/deposit',
    CommonValidationMiddleware.isValidParamsIdUuid,
    AccountController.getAccount
  );
};
