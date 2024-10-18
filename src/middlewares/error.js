import express from 'express';
import { HttpError } from '../utils/error.js';
import { logger } from '../loaders/pino.js';

/** @param {express.Application} app */
export default (app) => {
  app.use(notFound);
  app.use(errorHandler);
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function notFound(req, res, next) {
  const notFoundError = new HttpError(
    404,
    `Route not found - ${req.originalUrl}`
  );

  next(notFoundError);
}

/**
 * @param {Error} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function errorHandler(err, req, res, next) {
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
