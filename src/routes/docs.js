import swagger from 'swagger-ui-express';
import openapiDocument from '../docs/openapi.json' with { type: 'json' };

/** @import {Router} from 'express' */

/** @param {Router} appRouter */
export default async (appRouter) => {
  appRouter.use('/docs', swagger.serve, swagger.setup(openapiDocument));
};
