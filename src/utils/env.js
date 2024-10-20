import Joi from 'joi';
import dotenv from 'dotenv';
import { logger } from '../loaders/pino.js';
import { access } from 'fs/promises';
import { validStringSchema } from './validation.js';

/**
 * @typedef {Object} EnvSchema
 * @property {string} PORT - The port for the application.
 * @property {string} DATABASE_URL - The URL for the database connection.
 * @property {string} FRONTEND_URL - The URL for the frontend application.
 */

/** @type {Joi.ObjectSchema<EnvSchema>} */
export const envSchema = Joi.object({
  PORT: validStringSchema.required(),
  DATABASE_URL: validStringSchema.required(),
  FRONTEND_URL: validStringSchema.required()
})
  .options({ stripUnknown: true })
  .required();

function validateEnv() {
  const PORT = process.env.PORT ?? process.env.HOST_PORT;

  const mergedEnv = {
    ...process.env,
    PORT
  };

  const { value, error } = envSchema.validate(mergedEnv);

  if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
  }

  return value;
}

async function loadEnv() {
  const isRunningInDevelopment = process.env.NODE_ENV === 'development';

  let envPath = undefined;

  if (isRunningInDevelopment) {
    const isLocalEnvExists = await access('.env.local')
      .then(() => true)
      .catch(() => false);

    if (!isLocalEnvExists) {
      throw new Error('Local environment file (.env.local) is missing');
    }

    envPath = '.env.local';

    logger.info(`Loading environment variables from ${envPath}`);
  } else {
    logger.info('Loading environment variables from .env or process.env');
  }

  dotenv.config({ path: envPath });
}

await loadEnv();

export const appEnv = validateEnv();
