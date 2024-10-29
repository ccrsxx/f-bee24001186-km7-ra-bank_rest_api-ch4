import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

/**
 * @typedef {{
 *   TransactionController: Record<
 *     keyof import('../../controllers/transaction.js')['TransactionController'],
 *     jest.Mock
 *   >;
 * }} TransactionControllerMock
 */

/**
 * @typedef {{
 *   TransactionService: Record<
 *     keyof import('../../services/transaction.js')['TransactionService'],
 *     jest.Mock
 *   >;
 * }} TransactionServiceMock
 */

jest.unstable_mockModule(
  '../../services/transaction.js',
  () =>
    /** @type {TransactionServiceMock} */ ({
      TransactionService: {
        getTransaction: jest.fn(),
        getTransactions: jest.fn(),
        createTransaction: jest.fn()
      }
    })
);

const { TransactionController } = /** @type {TransactionControllerMock} */ (
  /** @type {unknown} */ (await import('../../controllers/transaction.js'))
);

const { TransactionService } = /** @type {TransactionServiceMock} */ (
  /** @type {unknown} */ (await import('../../services/transaction.js'))
);

describe('Transaction controller', () => {
  describe('Get transaction', () => {
    it('should get a transaction', async () => {
      const transaction = { id: '1', name: 'Transaction' };

      TransactionService.getTransaction.mockImplementation(() => transaction);

      const { req, res } = setupExpressMock({ req: { params: { id: '1' } } });

      await TransactionController.getTransaction(req, res);

      expect(TransactionService.getTransaction).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: transaction });
    });
  });

  describe('Get transactions', () => {
    it('should get transactions', async () => {
      const transactions = [{ id: '1', name: 'Transaction' }];

      TransactionService.getTransactions.mockImplementation(() => transactions);

      const { req, res } = setupExpressMock();

      await TransactionController.getTransactions(req, res);

      expect(TransactionService.getTransactions).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: transactions });
    });
  });

  describe('Create transaction', () => {
    it('should create a transaction', async () => {
      const transaction = { id: '1', name: 'Transaction' };

      TransactionService.createTransaction.mockImplementation(
        () => transaction
      );

      const { req, res } = setupExpressMock({
        req: { body: { name: 'Transaction' } }
      });

      await TransactionController.createTransaction(req, res);

      expect(TransactionService.createTransaction).toHaveBeenCalledWith(
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: transaction });
    });
  });
});
