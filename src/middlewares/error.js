import { HttpError } from '../utils/error.js';
import { logger } from '../loaders/pino.js';

/** @import {Application,Request,Response,NextFunction} from 'express' */

/** @param {Application} app */
export default (app) => {
  app.use(notFound);
  app.use(errorHandler);
};

/**
 * @param {Request} req
 * @param {Response} _res
 * @param {NextFunction} next
 */
export function notFound(req, _res, next) {
  const notFoundError = new HttpError(
    404,
    `Route not found - ${req.originalUrl}`
  );

  next(notFoundError);
}

/**
 * @param {Error} err
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} _next
 */
export function errorHandler(err, _req, res, _next) {
  logger.error(err);

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: { message: err.message } });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({ error: { message: err.message } });
    return;
  }

  res.status(500).json({ error: { message: 'Internal Server Error' } });
}
