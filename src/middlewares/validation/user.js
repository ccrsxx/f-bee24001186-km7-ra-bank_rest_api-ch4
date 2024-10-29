import Joi from 'joi';
import { validStringSchema } from '../../utils/validation.js';
import { HttpError } from '../../utils/error.js';

/** @import {Request,Response,NextFunction} from 'express' */
/** @import {Prisma} from '@prisma/client' */

/** @typedef {Prisma.UserCreateInput & Prisma.ProfileCreateWithoutUserInput} ValidUserPayload */

export class UserValidationMiddleware {
  /**
   * @param {Request<unknown, ValidUserPayload>} req
   * @param {Response} _res
   * @param {NextFunction} next
   */
  static isValidUserPayload(req, _res, next) {
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
      throw new HttpError(400, error.message);
    }

    next();
  }

  /**
   * @param {Request<{ id: string }>} req
   * @param {Response} _res
   * @param {NextFunction} next
   */
  static isValidParamsUserId(req, _res, next) {
    const validUserId = Joi.string().uuid().required();

    const { error } = validUserId.validate(req.params.id);

    if (error) {
      throw new HttpError(400, error.message);
    }

    next();
  }
}
