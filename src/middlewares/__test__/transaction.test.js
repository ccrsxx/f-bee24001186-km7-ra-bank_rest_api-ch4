import { jest } from '@jest/globals';
import {
  generatePrismaMock,
  getFunctionThrownError
} from '../../utils/jest.js';
import { HttpError } from '../../utils/error.js';
import { setupExpressMock } from '../../utils/jest.js';

/** @import {GeneratedPrismaMock} from '../../utils/jest.js' */

/**
 * @typedef {{
 *   TransactionMiddleware: Record<
 *     keyof import('../transaction.js')['TransactionMiddleware'],
 *     jest.Mock
 *   >;
 * }} AccountMiddlewareMock
 */

jest.unstable_mockModule('../../utils/db.js', generatePrismaMock);

const { prisma } = /** @type {GeneratedPrismaMock} */ (
  /** @type {unknown} */ (await import('../../utils/db.js'))
);

const { TransactionMiddleware } = /** @type {AccountMiddlewareMock} */ (
  /** @type {unknown} */ (await import('../transaction.js'))
);

describe('Transaction middleware', () => {
  it('should call next if source account belongs to user', async () => {
    const { req, res, next } = setupExpressMock({
      req: { body: { sourceAccountId: '1' } },
      res: { locals: { user: { id: '1' } } }
    });

    prisma.account.findFirst.mockImplementation(() => ({
      id: '1',
      userId: '1'
    }));

    await TransactionMiddleware.isSourceAccountBelongToUser(req, res, next);

    expect(prisma.account.findFirst).toHaveBeenCalledWith({
      where: {
        id: '1',
        userId: '1'
      }
    });

    expect(next).toHaveBeenCalled();
  });

  it('should throw an error if source account does not belong to user', async () => {
    const { req, res, next } = setupExpressMock({
      req: { body: { sourceAccountId: '1' } },
      res: { locals: { user: { id: '1' } } }
    });

    prisma.account.findFirst.mockImplementation(() => null);

    const promise = TransactionMiddleware.isSourceAccountBelongToUser(
      req,
      res,
      next
    );

    const error = await getFunctionThrownError(() => promise);

    expect(error).toBeInstanceOf(HttpError);
    expect(error).toHaveProperty('statusCode', 403);
    expect(error).toHaveProperty('message', 'Account does not belong to user');
  });
});
