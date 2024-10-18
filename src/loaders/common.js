import express, { json } from 'express';

/** @param {express.Application} app */
export default (app) => {
  app.use(json());
};
