import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';

/** @import {User} from '@prisma/client' */
/** @import {Request,Response,NextFunction} from 'express' */

export class AccountMiddleware {
  /**
   * @param {Request<{ id: string }>} req
   * @param {Response<unknown, { user: User }>} res
   * @param {NextFunction} next
   */
  static async isAccountBelongsToUser(req, res, next) {
    const { id } = req.params;
    const { user } = res.locals;

    const accountBelongsToUser = await prisma.account.findFirst({
      where: {
        id,
        userId: user.id
      }
    });

    if (!accountBelongsToUser) {
      throw new HttpError(403, 'Account does not belong to user');
    }

    next();
  }
}
