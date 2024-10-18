import express from 'express';
import { createServer } from 'http';
import loaders from './loaders/index.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.js';
import { appEnv } from './utils/env.js';
import { logger } from './loaders/pino.js';

function main() {
  const app = express();
  const server = createServer(app);

  loaders(app, server);

  routes(app);

  errorHandler(app);

  server.listen(appEnv.PORT, () => {
    logger.info(`Server running on port ${appEnv.PORT}`);
  });
}

try {
  main();
} catch (error) {
  logger.error(error);
  process.exit(1);
}
