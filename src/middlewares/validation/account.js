import Joi from 'joi';
import express from 'express';
import { Prisma } from '@prisma/client';
import { logger } from '../../loaders/pino.js';
import { validStringSchema } from '../../utils/validation.js';

/** @typedef {Prisma.AccountCreateWithoutUserInput & { userId: string }} ValidAccountPayload */
/** @typedef {{ amount: number }} ValidAmountPayload */

export class AccountValidationMiddleware {
  /**
   * @param {express.Request<unknown, unknown, ValidAccountPayload>} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static isValidAccountPayload(req, res, next) {
    /** @type {Joi.ObjectSchema<ValidAccountPayload>} */
    const validUserPayload = Joi.object({
      userId: validStringSchema.required(),
      bankName: validStringSchema.required()
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
   * @param {express.Request<unknown, unknown, ValidAmountPayload>} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static isValidAmountPayload(req, res, next) {
    /** @type {Joi.ObjectSchema<ValidAmountPayload>} */
    const validAmountPayload = Joi.object({
      amount: Joi.number().positive().required()
    }).required();

    const { error } = validAmountPayload.validate(req.body);

    if (error) {
      logger.error(error.message);
      res.status(400).json({ error: { message: error.message } });
      return;
    }

    next();
  }
}
