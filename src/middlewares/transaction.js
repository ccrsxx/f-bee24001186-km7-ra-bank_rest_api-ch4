import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';

/** @import {Request,Response,NextFunction} from 'express' */
/** @import {ApiResponse} from '../utils/types/api.js' */
/** @import {ValidTransactionPayload} from './validation/transaction.js' */

export class TransactionMiddleware {
  /**
   * @param {Request<unknown, unknown, ValidTransactionPayload>} req
   * @param {Response<ApiResponse>} res
   * @param {NextFunction} next
   */
  static async isSourceAccountBelongToUser(req, res, next) {
    const { sourceAccountId } = req.body;
    const { user } = res.locals;

    const sourceAccountBelongToUser = await prisma.account.findFirst({
      where: {
        id: sourceAccountId,
        userId: user.id
      }
    });

    if (!sourceAccountBelongToUser) {
      throw new HttpError(403, 'Account does not belong to user');
    }

    next();
  }
}
