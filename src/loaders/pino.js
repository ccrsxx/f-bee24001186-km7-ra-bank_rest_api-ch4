import Pino from 'pino';
import PinoHttp from 'pino-http';
import express from 'express';

/** @type {Pino.LoggerOptions} */
const developmentLoggerOptions = {
  transport: {
    target: 'pino-pretty'
  }
};

/** @type {Pino.LoggerOptions} */
const productionLoggerOptions = {
  formatters: {
    level(label) {
      return { severity: label };
    }
  },
  messageKey: 'message'
};

const loggerOptions =
  process.env.NODE_ENV === 'production'
    ? productionLoggerOptions
    : developmentLoggerOptions;

export const logger = Pino(loggerOptions);

const pinoHttp = PinoHttp({
  logger
});

/** @param {express.Application} app */
export default (app) => {
  app.use(pinoHttp);
};
