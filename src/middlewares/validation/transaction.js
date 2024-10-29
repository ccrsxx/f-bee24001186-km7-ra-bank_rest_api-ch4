import Joi from 'joi';
import { validStringSchema } from '../../utils/validation.js';
import { HttpError } from '../../utils/error.js';

/** @import {Request,Response,NextFunction} from 'express' */

/**
 * @typedef {Object} ValidTransactionPayload
 * @property {number} amount
 * @property {string} sourceAccountId
 * @property {string} destinationAccountId
 */

export class TransactionValidationMiddleware {
  /**
   * @param {Request<unknown, unknown, ValidTransactionPayload>} req
   * @param {Response} _res
   * @param {NextFunction} next
   */
  static isValidTransactionPayload(req, _res, next) {
    /** @type {Joi.ObjectSchema<ValidTransactionPayload>} */
    const validUserPayload = Joi.object({
      amount: Joi.number().positive().required(),
      sourceAccountId: validStringSchema.required(),
      destinationAccountId: validStringSchema.required()
    }).required();

    const { error } = validUserPayload.validate(req.body);

    if (error) {
      throw new HttpError(400, error.message);
    }

    next();
  }

  /**
   * @param {Request<unknown, unknown, ValidTransactionPayload>} req
   * @param {Response} _res
   * @param {NextFunction} next
   */
  static isBothAccountDifferent(req, _res, next) {
    const { sourceAccountId, destinationAccountId } = req.body;

    const isBothAccountTheSame = sourceAccountId === destinationAccountId;

    if (isBothAccountTheSame) {
      throw new HttpError(400, "Both account can't be the same");
    }

    next();
  }
}
