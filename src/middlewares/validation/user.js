import Joi from 'joi';
import express from 'express';
import { validStringSchema } from '../../utils/validation.js';
import { Prisma } from '@prisma/client';
import { logger } from '../../loaders/pino.js';

/** @typedef {Prisma.UserCreateInput & Prisma.ProfileCreateWithoutUserInput} ValidUserPayload */

export class UserValidationMiddleware {
  /**
   * @param {express.Request<unknown, ValidUserPayload>} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static isValidUserPayload(req, res, next) {
    /** @type {Joi.ObjectSchema<ValidUserPayload>} */
    const validUserPayload = Joi.object({
      name: validStringSchema.required(),
      email: Joi.string().email().required(),
      address: validStringSchema.required(),
      password: validStringSchema.min(8).required(),
      identityType: validStringSchema.required(),
      identityNumber: validStringSchema.required()
    }).required();

    const { error } = validUserPayload.validate(req.body);

    if (error) {
      res.status(400).json({ error: { message: error.message } });
      return;
    }

    next();
  }

  /**
   * @param {express.Request<{ id: string }>} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static isValidParamsUserId(req, res, next) {
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
