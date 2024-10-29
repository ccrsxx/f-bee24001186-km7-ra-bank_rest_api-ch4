import Joi from 'joi';
import { HttpError } from '../../utils/error.js';

/** @import {Request,Response,NextFunction} from 'express' */

/**
 * @typedef {Object} ValidLoginPayload
 * @property {string} email
 * @property {string} password
 */

export class AuthValidationMiddleware {
  /**
   * @param {Request<{ id: string }>} req
   * @param {Response} _res
   * @param {NextFunction} next
   */
  static isValidLoginPayload(req, _res, next) {
    /** @type {Joi.ObjectSchema<ValidLoginPayload>} */
    const validLoginPayload = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    }).required();

    const { error } = validLoginPayload.validate(req.body);

    if (error) {
      throw new HttpError(400, error.message);
    }

    next();
  }
}
