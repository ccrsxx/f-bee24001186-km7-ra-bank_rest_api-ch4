import Joi from 'joi';
import { validStringSchema } from '../../utils/validation.js';
import { HttpError } from '../../utils/error.js';

/** @import {Request,Response,NextFunction} from 'express' */
/** @import {Prisma,User} from '@prisma/client' */

/** @typedef {Prisma.AccountCreateWithoutUserInput & { userId: string }} ValidAccountPayload */
/** @typedef {{ amount: number }} ValidAmountPayload */

export class AccountValidationMiddleware {
  /**
   * @param {Request<unknown, unknown, ValidAccountPayload>} req
   * @param {Response<unknown, { user: User }>} _res
   * @param {NextFunction} next
   */
  static isValidAccountPayload(req, _res, next) {
    /** @type {Joi.ObjectSchema<ValidAccountPayload>} */
    const validUserPayload = Joi.object({
      bankName: validStringSchema.required()
    }).required();

    const { error } = validUserPayload.validate(req.body);

    if (error) {
      throw new HttpError(400, error.message);
    }

    next();
  }

  /**
   * @param {Request<unknown, unknown, ValidAmountPayload>} req
   * @param {Response} _res
   * @param {NextFunction} next
   */
  static isValidAmountPayload(req, _res, next) {
    /** @type {Joi.ObjectSchema<ValidAmountPayload>} */
    const validAmountPayload = Joi.object({
      amount: Joi.number().positive().required()
    }).required();

    const { error } = validAmountPayload.validate(req.body);

    if (error) {
      throw new HttpError(400, error.message);
    }

    next();
  }
}
