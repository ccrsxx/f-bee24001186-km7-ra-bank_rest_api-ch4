import cors from './cors.js';
import pino from './pino.js';
import common from './common.js';

/** @import {Express} from 'express' */
/** @import {Server} from 'http' */

/**
 * @param {Express} app
 * @param {Server} _server
 */
export default (app, _server) => {
  cors(app);
  pino(app);
  common(app);
};
