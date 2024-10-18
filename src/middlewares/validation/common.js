import Joi from 'joi';
import express from 'express';
import { logger } from '../../loaders/pino.js';

export class CommonValidationMiddleware {
  /**
   * @param {express.Request<{ id: string }>} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static isValidParamsIdUuid(req, res, next) {
    const validUserId = Joi.string().uuid().required();

    const { error } = validUserId.validate(req.params.id);

    if (error) {
      logger.error(error.message);
      res.status(400).json({ error: { message: error.message } });
      return;
    }

    next();
  }
}
