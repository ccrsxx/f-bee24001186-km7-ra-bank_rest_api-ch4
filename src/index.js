import express from 'express';
import { createServer } from 'http';
import loaders from './loaders/index.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.js';
import { appEnv } from './utils/env.js';
import { logger } from './loaders/pino.js';

function main() {
  logger.info('Test CI on PR');

  const app = express();
  const server = createServer(app);

  loaders(app, server);

  routes(app);

  errorHandler(app);

  server.listen(appEnv.PORT, () => {
    logger.info(`Server running on port ${appEnv.PORT}`);
  });
}

/** Listen for termination signal */
process.on('SIGTERM', () => {
  // Clean up resources on shutdown
  logger.info('Caught SIGTERM.');
  logger.flush();
});

main();
