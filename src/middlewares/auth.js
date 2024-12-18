import { AuthService } from '../services/auth.js';
import { HttpError } from '../utils/error.js';

/** @import {Request,Response,NextFunction} from 'express' */
/** @import {User} from '@prisma/client' */

export class AuthMiddleware {
  /**
   * @param {Request} req
   * @param {Response<unknown, { user: User }>} res
   * @param {NextFunction} next
   */
  static async isAuthorized(req, res, next) {
    const authorization = req.get('authorization');

    if (!authorization) {
      throw new HttpError(401, 'Invalid token');
    }

    const [type, token] = authorization.split(' ');

    if (type.toLocaleLowerCase() !== 'bearer') {
      throw new HttpError(401, 'Invalid token');
    }

    const user = await AuthService.verifyToken(token);

    res.locals.user = user;

    next();
  }
}
