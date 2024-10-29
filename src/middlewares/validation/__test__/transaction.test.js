import { setupExpressMock } from '../../../utils/jest.js';
import { HttpError } from '../../../utils/error.js';
import { getFunctionThrownError } from '../../../utils/jest.js';

/**
 * @typedef {{
 *   TransactionValidationMiddleware: Record<
 *     keyof import('../transaction.js')['TransactionValidationMiddleware'],
 *     jest.Mock
 *   >;
 * }} TransactionValidationMiddlewareMock
 */

const { TransactionValidationMiddleware } =
  /** @type {TransactionValidationMiddlewareMock} */ (
    /** @type {unknown} */ (await import('../transaction.js'))
  );

describe('Transaction validation middleware', () => {
  describe('Is valid transaction payload', () => {
    it('should call next() if the payload is valid', () => {
      const { req, res, next } = setupExpressMock({
        req: {
          body: {
            amount: 100,
            sourceAccountId: '1',
            destinationAccountId: '2'
          }
        }
      });

      TransactionValidationMiddleware.isValidTransactionPayload(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 400 http error if the payload is invalid', async () => {
      const { req, res, next } = setupExpressMock({
        req: {
          body: {
            sourceAccountId: '1',
            destinationAccountId: '2'
          }
        }
      });

      const error = await getFunctionThrownError(() =>
        TransactionValidationMiddleware.isValidTransactionPayload(
          req,
          res,
          next
        )
      );

      expect(error).toBeInstanceOf(HttpError);
      expect(error).toHaveProperty('statusCode', 400);
      expect(error).toHaveProperty('message', '"amount" is required');

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Is both account different', () => {
    it('should call next() if the sourceAccountId and destinationAccountId is different', () => {
      const { req, res, next } = setupExpressMock({
        req: {
          body: {
            amount: 100,
            sourceAccountId: '1',
            destinationAccountId: '3'
          }
        }
      });

      TransactionValidationMiddleware.isBothAccountDifferent(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 400 http error if the sourceAccountId and destinationAccountId is the same', async () => {
      const { req, res, next } = setupExpressMock({
        req: {
          body: {
            sourceAccountId: '1',
            destinationAccountId: '1'
          }
        }
      });

      const error = await getFunctionThrownError(() =>
        TransactionValidationMiddleware.isBothAccountDifferent(req, res, next)
      );

      expect(error).toBeInstanceOf(HttpError);
      expect(error).toHaveProperty('statusCode', 400);
      expect(error).toHaveProperty('message', "Both account can't be the same");

      expect(next).not.toHaveBeenCalled();
    });
  });
});
