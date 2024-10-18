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
        balance: 0,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });

    return data;
  }
}
