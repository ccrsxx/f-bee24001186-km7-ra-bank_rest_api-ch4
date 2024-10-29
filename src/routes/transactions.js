import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.js';
import { TransactionController } from '../controllers/transaction.js';
import { CommonValidationMiddleware } from '../middlewares/validation/common.js';
import { TransactionValidationMiddleware } from '../middlewares/validation/transaction.js';
import { TransactionMiddleware } from '../middlewares/transaction.js';

/** @param {Router} appRouter */
export default (appRouter) => {
  const router = Router();

  appRouter.use('/transactions', router);

  router.get('/', TransactionController.getTransactions);

  router.post(
    '/',
    AuthMiddleware.isAuthorized,
    TransactionValidationMiddleware.isBothAccountDifferent,
    TransactionValidationMiddleware.isValidTransactionPayload,
    TransactionMiddleware.isSourceAccountBelongToUser,
    TransactionController.createTransaction
  );

  router.get(
    '/:id',
    CommonValidationMiddleware.isValidParamsIdUuid,
    TransactionController.getTransaction
  );
};
