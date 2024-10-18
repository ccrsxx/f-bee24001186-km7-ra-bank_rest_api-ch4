import { logger } from '../loaders/pino.js';
import { prisma } from '../utils/db.js';
import { Prisma } from '@prisma/client';
import { HttpError } from '../utils/error.js';

/** @import {ValidTransactionPayload} from '../middlewares/validation/transaction.js' */

export class TransactionService {
  /** @param {string} id */
  static async getTransaction(id) {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id
      }
    });

    if (!transaction) {
      throw new HttpError(404, 'Account not found');
    }

    return transaction;
  }

  static async getTransactions() {
    const transactions = await prisma.transaction.findMany({
      include: {
        sourceAccount: {
          include: {
            user: true
          }
        },
        destinationAccount: {
          include: {
            user: true
          }
        }
      }
    });

    return transactions;
  }

  /** @param {ValidTransactionPayload} transaction */
  static async createTransaction(transaction) {
    const { amount, sourceAccountId, destinationAccountId } = transaction;

    const sourceAccount = await prisma.account.findUnique({
      where: {
        id: sourceAccountId
      }
    });

    if (!sourceAccount) {
      throw new HttpError(404, 'Source account not found');
    }

    const destinationAccount = await prisma.account.findUnique({
      where: {
        id: destinationAccountId
      }
    });

    if (!destinationAccount) {
      throw new HttpError(404, 'Destination account not found');
    }

    const sourceBalance = new Prisma.Decimal(sourceAccount.balance);

    const isSourceBalanceEnough = sourceBalance.greaterThanOrEqualTo(amount);

    if (!isSourceBalanceEnough) {
      throw new HttpError(400, 'Insufficient balance');
    }

    const updateSourceAccountPromise = prisma.account.update({
      where: {
        id: sourceAccountId
      },
      data: {
        balance: sourceBalance.minus(amount)
      }
    });

    const updateDestinationAccountPromise = prisma.account.update({
      where: {
        id: destinationAccountId
      },
      data: {
        balance: new Prisma.Decimal(destinationAccount.balance).add(amount)
      }
    });

    const createTransactionPromise = prisma.transaction.create({
      data: {
        amount,
        sourceAccountId,
        destinationAccountId
      }
    });

    const [, , transactionData] = await prisma.$transaction([
      updateSourceAccountPromise,
      updateDestinationAccountPromise,
      createTransactionPromise
    ]);

    return transactionData;
  }
}
