import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.js';
import { TransactionValidationMiddleware } from '../middlewares/validation/transaction.js';
import { CommonValidationMiddleware } from '../middlewares/validation/common.js';

/** @param {Router} appRouter */
export default (appRouter) => {
  const router = Router();

  appRouter.use('/transactions', router);

  router.get('/', TransactionController.getTransactions);

  router.post(
    '/',
    TransactionValidationMiddleware.isBothAccountDifferent,
    TransactionValidationMiddleware.isValidTransactionPayload,
    TransactionController.createTransaction
  );

  router.get(
    '/:id',
    CommonValidationMiddleware.isValidParamsIdUuid,
    TransactionController.getTransaction
  );
};
