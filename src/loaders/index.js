import server from 'http';
import express from 'express';
import cors from './cors.js';
import pino from './pino.js';
import common from './common.js';

/**
 * @param {express.Express} app
 * @param {server.Server} server
 */
export default (app, server) => {
  cors(app);
  pino(app);
  common(app);
};
