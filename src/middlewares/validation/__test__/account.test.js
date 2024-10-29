import { HttpError } from '../../../utils/error.js';
import {
  getFunctionThrownError,
  setupExpressMock
} from '../../../utils/jest.js';

/**
 * @typedef {{
 *   AccountValidationMiddleware: Record<
 *     keyof import('../account.js')['AccountValidationMiddleware'],
 *     jest.Mock
 *   >;
 * }} AccountValidationMiddlewareMock
 */

const { AccountValidationMiddleware } =
  /** @type {AccountValidationMiddlewareMock} */ (
    /** @type {unknown} */ (await import('../account.js'))
  );

describe('Account validation middleware', () => {
  describe('Is valid account payload', () => {
    it('should call next() if the payload is valid', () => {
      const { req, res, next } = setupExpressMock({
        req: {
          body: {
            bankName: 'Test Bank'
          }
        }
      });

      AccountValidationMiddleware.isValidAccountPayload(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 400 http error if the payload is invalid', async () => {
      const { req, res, next } = setupExpressMock({
        req: {
          body: {
            bankName: 100
          }
        }
      });

      const error = await getFunctionThrownError(() =>
        AccountValidationMiddleware.isValidAccountPayload(req, res, next)
      );

      expect(error).toBeInstanceOf(HttpError);
      expect(error).toHaveProperty('statusCode', 400);
      expect(error).toHaveProperty('message', '"bankName" must be a string');

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Is valid amount payload', () => {
    it('should call next() if the payload is valid', () => {
      const { req, res, next } = setupExpressMock({
        req: {
          body: {
            amount: 100
          }
        }
      });

      AccountValidationMiddleware.isValidAmountPayload(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 400 http erro if the payload is invalid', async () => {
      const { req, res, next } = setupExpressMock({
        req: {
          body: {
            amount: -100
          }
        }
      });

      const error = await getFunctionThrownError(() =>
        AccountValidationMiddleware.isValidAmountPayload(req, res, next)
      );

      expect(error).toBeInstanceOf(HttpError);
      expect(error).toHaveProperty('statusCode', 400);
      expect(error).toHaveProperty(
        'message',
        '"amount" must be a positive number'
      );

      expect(next).not.toHaveBeenCalled();
    });
  });
});
