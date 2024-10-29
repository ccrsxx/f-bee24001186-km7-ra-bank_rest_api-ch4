import { jest } from '@jest/globals';
import { HttpError } from '../../utils/error.js';
import { getFunctionThrownError } from '../../utils/jest.js';
import { generatePrismaMock } from '../../utils/jest.js';

/** @import {GeneratedPrismaMock} from '../../utils/jest.js' */

jest.unstable_mockModule('../../utils/db.js', generatePrismaMock);

const { TransactionService } = await import('../transaction.js');

const { prisma } = /** @type {GeneratedPrismaMock} */ (
  /** @type {unknown} */ (await import('../../utils/db.js'))
);

describe('Transaction service', () => {
  describe('Get transaction', () => {
    it('should return a transaction if transaction exists', async () => {
      const id = '1';

      const transaction = {
        id: '1',
        amount: 100,
        sourceAccountId: '1',
        destinationAccountId: '2'
      };

      prisma.transaction.findUnique.mockImplementation(() => transaction);

      const result = await TransactionService.getTransaction(id);

      expect(result).toEqual(transaction);
    });

    it('should throw 404 http error if transaction does not exist', async () => {
      prisma.transaction.findUnique.mockImplementation(() => null);

      const promise = TransactionService.getTransaction('1');

      const error = await getFunctionThrownError(() => promise);

      expect(error).toBeInstanceOf(HttpError);

      expect(error).toHaveProperty('statusCode', 404);
      expect(error).toHaveProperty('message', 'Account not found');
    });
  });

  describe('Get transactions', () => {
    it('should return a list of transactions', async () => {
      const transactions = Array.from({ length: 3 }, (_, i) => ({
        id: i.toString(),
        amount: 100,
        sourceAccountId: '1',
        destinationAccountId: '2'
      }));

      prisma.transaction.findMany.mockImplementation(() => transactions);

      const result = await TransactionService.getTransactions();

      expect(result).toEqual(transactions);
    });
  });

  describe('Create transaction', () => {
    it('should create a transaction', async () => {
      const sourceAccount = {
        id: '1',
        bankName: 'Bank A',
        userId: '1',
        balance: 100
      };

      const destinationAccount = {
        id: '2',
        bankName: 'Bank B',
        userId: '2',
        balance: 0
      };

      const createdTransaction = {
        id: '1',
        amount: 100,
        sourceAccountId: '1',
        destinationAccountId: '2'
      };

      const multipleFindUniqueMock = jest
        .fn()
        .mockImplementationOnce(() => sourceAccount)
        .mockImplementationOnce(() => destinationAccount);

      prisma.account.findUnique.mockImplementation(multipleFindUniqueMock);

      prisma.transaction.create.mockImplementation(() => createdTransaction);

      prisma.$transaction.mockImplementation(() => [, , createdTransaction]);

      const transaction = {
        amount: 100,
        sourceAccountId: '1',
        destinationAccountId: '2'
      };

      const result = await TransactionService.createTransaction(transaction);

      expect(result).toEqual(createdTransaction);
    });

    it('should throw 404 http error if source account does not exist', async () => {
      prisma.account.findUnique.mockImplementation(() => null);

      const promise = TransactionService.createTransaction({
        amount: 100,
        sourceAccountId: '1',
        destinationAccountId: '2'
      });

      const error = await getFunctionThrownError(() => promise);

      expect(error).toBeInstanceOf(HttpError);

      expect(error).toHaveProperty('statusCode', 404);
      expect(error).toHaveProperty('message', 'Source account not found');
    });

    it('should throw 404 http error if destination account does not exist', async () => {
      const sourceAccount = {
        id: '1',
        bankName: 'Bank A',
        userId: '1',
        balance: 100
      };

      prisma.account.findUnique.mockImplementationOnce(() => sourceAccount);

      prisma.account.findUnique.mockImplementationOnce(() => null);

      const promise = TransactionService.createTransaction({
        amount: 100,
        sourceAccountId: '1',
        destinationAccountId: '2'
      });

      const error = await getFunctionThrownError(() => promise);

      expect(error).toBeInstanceOf(HttpError);

      expect(error).toHaveProperty('statusCode', 404);
      expect(error).toHaveProperty('message', 'Destination account not found');
    });

    it('should throw 403 http error if source account balance is insufficient', async () => {
      const sourceAccount = {
        id: '1',
        bankName: 'Bank A',
        userId: '1',
        balance: 0
      };

      const destinationAccount = {
        id: '2',
        bankName: 'Bank B',
        userId: '2',
        balance: 0
      };

      prisma.account.findUnique.mockImplementationOnce(() => sourceAccount);

      prisma.account.findUnique.mockImplementationOnce(
        () => destinationAccount
      );

      const promise = TransactionService.createTransaction({
        amount: 100,
        sourceAccountId: '1',
        destinationAccountId: '2'
      });

      const error = await getFunctionThrownError(() => promise);

      expect(error).toBeInstanceOf(HttpError);

      expect(error).toHaveProperty('statusCode', 403);
      expect(error).toHaveProperty('message', 'Insufficient balance');
    });
  });
});
