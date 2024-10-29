import Joi from 'joi';
import { HttpError } from '../../utils/error.js';

/** @import {Request,Response,NextFunction} from 'express' */

export class CommonValidationMiddleware {
  /**
   * @param {Request<{ id: string }>} req
   * @param {Response} _res
   * @param {NextFunction} next
   */
  static isValidParamsIdUuid(req, _res, next) {
    const validUserId = Joi.string().uuid().required();

    const { error } = validUserId.validate(req.params.id);

    if (error) {
      throw new HttpError(400, error.message);
    }

    next();
  }
}
