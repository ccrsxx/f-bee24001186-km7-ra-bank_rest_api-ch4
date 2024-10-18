import cors from 'cors';
import express from 'express';
import { appEnv } from '../utils/env.js';

/** @type {cors.CorsOptions} */
export const corsOptions = {
  origin: appEnv.FRONTEND_URL,
  credentials: true
};

/** @param {express.Application} app */
export default (app) => {
  app.use(cors(corsOptions));
};
