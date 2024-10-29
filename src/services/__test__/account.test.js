import { jest } from '@jest/globals';
import { generatePrismaMock } from '../../utils/jest.js';
import { HttpError } from '../../utils/error.js';
import { getFunctionThrownError } from '../../utils/jest.js';

/** @import {GeneratedPrismaMock} from '../../utils/jest.js' */

/**
 * @typedef {{
 *   AccountService: Record<
 *     keyof import('../account.js')['AccountService'],
 *     jest.Mock
 *   >;
 * }} AccountServiceMock
 */

jest.unstable_mockModule('../../utils/db.js', generatePrismaMock);

const { AccountService } = /** @type {AccountServiceMock} */ (
  /** @type {unknown} */ (await import('../account.js'))
);

const { prisma } = /** @type {GeneratedPrismaMock} */ (
  /** @type {unknown} */ (await import('../../utils/db.js'))
);

describe('Account service', () => {
  describe('Get account', () => {
    it('should return an account if account exists', async () => {
      const body = {
        id: '1',
        bankName: 'Bank A',
        userId: '1'
      };

      prisma.account.findUnique.mockImplementation(() => body);

      const result = await AccountService.getAccount('1');

      expect(result).toEqual(body);
    });

    it('should throw 404 http error if account does not exist', async () => {
      prisma.account.findUnique.mockImplementation(() => null);

      const promise = AccountService.getAccount('1');

      const error = await getFunctionThrownError(() => promise);

      expect(error).toBeInstanceOf(HttpError);
      expect(error).toHaveProperty('statusCode', 404);
      expect(error).toHaveProperty('message', 'Account not found');
    });
  });

  describe('Get accounts', () => {
    it('should return a list of accounts', async () => {
      const body = [
        {
          id: '1',
          bankName: 'Bank A',
          userId: '1'
        },
        {
          id: '2',
          bankName: 'Bank B',
          userId: '2'
        }
      ];

      prisma.account.findMany.mockImplementation(() => body);

      const result = await AccountService.getAccounts();

      expect(result).toEqual(body);
    });
  });

  describe('Create account', () => {
    it('should create an account', async () => {
      const user = {
        id: '1',
        name: 'User A'
      };

      const account = {
        id: '1',
        bankName: 'Bank A'
      };

      prisma.user.findUnique.mockImplementation(() => user);

      prisma.account.create.mockImplementation(() => account);

      const result = await AccountService.createAccount(user.id, {
        bankName: 'Bank A'
      });

      expect(result).toEqual(account);
    });

    it('should throw 404 http error if user does not exist', async () => {
      prisma.user.findUnique.mockImplementation(() => null);

      const user = {
        id: '1',
        name: 'User A'
      };

      const promise = AccountService.createAccount(user.id, {
        bankName: 'Bank A'
      });

      const error = await getFunctionThrownError(() => promise);

      expect(error).toBeInstanceOf(HttpError);
      expect(error).toHaveProperty('statusCode', 404);
      expect(error).toHaveProperty('message', 'User not found');
    });
  });

  describe('Deposit account', () => {
    it('should deposit to an account', async () => {
      const account = {
        id: '1',
        bankName: 'Bank A',
        userId: '1',
        balance: 100
      };

      prisma.account.findUnique.mockImplementation(() => account);

      prisma.account.update.mockImplementation(() => account);

      const result = await AccountService.depositAccount('1', 100);

      expect(result).toEqual(account);
    });

    it('should throw 404 http error if account does not exist', async () => {
      prisma.account.findUnique.mockImplementation(() => null);

      const promise = AccountService.depositAccount('1', 100);

      const error = await getFunctionThrownError(() => promise);

      expect(error).toBeInstanceOf(HttpError);
      expect(error).toHaveProperty('statusCode', 404);
      expect(error).toHaveProperty('message', 'Account not found');
    });
  });

  describe('Withdraw account', () => {
    it('should withdraw from an account', async () => {
      const account = {
        id: '1',
        bankName: 'Bank A',
        userId: '1',
        balance: 100
      };

      prisma.account.findUnique.mockImplementation(() => account);

      prisma.account.update.mockImplementation(() => account);

      const result = await AccountService.withdrawAccount('1', 100);

      expect(result).toEqual(account);
    });

    it('should throw 404 http error if account does not exist', async () => {
      prisma.account.findUnique.mockImplementation(() => null);

      const promise = AccountService.withdrawAccount('1', 100);

      const error = await getFunctionThrownError(() => promise);

      expect(error).toBeInstanceOf(HttpError);
      expect(error).toHaveProperty('statusCode', 404);
      expect(error).toHaveProperty('message', 'Account not found');
    });

    it('should throw an error if balance is insufficient', async () => {
      const account = {
        id: '1',
        bankName: 'Bank A',
        userId: '1',
        balance: 100
      };

      prisma.account.findUnique.mockImplementation(() => account);

      const promise = AccountService.withdrawAccount('1', 200);

      const error = await getFunctionThrownError(() => promise);

      expect(error).toBeInstanceOf(HttpError);
      expect(error).toHaveProperty('statusCode', 403);
      expect(error).toHaveProperty('message', 'Insufficient balance');
    });
  });
});
