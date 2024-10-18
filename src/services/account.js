import { Prisma } from '@prisma/client';
import { logger } from '../loaders/pino.js';
import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';

/** @import {ValidAccountPayload} from '../middlewares/validation/account.js' */

export class AccountService {
  /** @param {string} id */
  static async getAccount(id) {
    const account = await prisma.account.findUnique({
      where: {
        id
      },
      include: {
        user: true
      }
    });

    if (!account) {
      throw new HttpError(404, 'Account not found');
    }

    return account;
  }

  static async getAccounts() {
    const accounts = await prisma.account.findMany({
      include: {
        user: true
      }
    });

    return accounts;
  }

  /** @param {ValidAccountPayload} account */
  static async createAccount(account) {
    const { userId, bankName } = account;

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    const data = await prisma.account.create({
      data: {
        bankName,
        user: {
          connect: {
            id: userId
          }
        }
      },
      include: {
        user: true
      }
    });

    return data;
  }

  /**
   * @param {string} id
   * @param {number} amount
   */
  static async withdrawAccount(id, amount) {
    const account = await prisma.account.findUnique({
      where: {
        id
      }
    });

    if (!account) {
      throw new HttpError(404, 'Account not found');
    }

    const balanceDecimal = new Prisma.Decimal(account.balance);

    const balanceEnough = balanceDecimal.greaterThanOrEqualTo(amount);

    if (!balanceEnough) {
      throw new HttpError(400, 'Insufficient balance');
    }

    const data = await prisma.account.update({
      where: {
        id
      },
      data: {
        balance: {
          decrement: amount
        }
      },
      include: {
        user: true
      }
    });

    return data;
  }

  /**
   * @param {string} id
   * @param {number} amount
   */
  static async depositAccount(id, amount) {
    const account = await prisma.account.findUnique({
      where: {
        id
      }
    });

    if (!account) {
      throw new HttpError(404, 'Account not found');
    }

    const data = await prisma.account.update({
      where: {
        id
      },
      data: {
        balance: {
          increment: amount
        }
      },
      include: {
        user: true
      }
    });

    return data;
  }
}
