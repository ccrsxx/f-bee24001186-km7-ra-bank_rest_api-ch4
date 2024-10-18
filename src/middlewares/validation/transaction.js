import Joi from 'joi';
import express from 'express';
import { logger } from '../../loaders/pino.js';
import { validStringSchema } from '../../utils/validation.js';

/**
 * @typedef {Object} ValidTransactionPayload
 * @property {number} amount
 * @property {string} sourceAccountId
 * @property {string} destinationAccountId
 */

export class TransactionValidationMiddleware {
  /**
   * @param {express.Request<unknown, ValidTransactionPayload>} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static isValidTransactionPayload(req, res, next) {
    /** @type {Joi.ObjectSchema<ValidTransactionPayload>} */
    const validUserPayload = Joi.object({
      amount: Joi.number().required(),
      sourceAccountId: validStringSchema.required(),
      destinationAccountId: validStringSchema.required()
    }).required();

    const { error } = validUserPayload.validate(req.body);

    if (error) {
      logger.error(error.message);
      res.status(400).json({ error: { message: error.message } });
      return;
    }

    next();
  }

  /**
   * @param {express.Request<unknown, ValidTransactionPayload>} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static isBothAccountDifferent(req, res, next) {
    const { sourceAccountId, destinationAccountId } = req.body;

    const isBothAccountTheSame = sourceAccountId === destinationAccountId;

    if (isBothAccountTheSame) {
      res
        .status(400)
        .json({ error: { message: "Both account can't be the same" } });
      return;
    }

    next();
  }
}
