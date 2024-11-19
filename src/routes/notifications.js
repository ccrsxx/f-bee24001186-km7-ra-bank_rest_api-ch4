/** @import {Router} from 'express' */

/** @param {Router} appRouter */
export default async (appRouter) => {
  appRouter.use('/notifications', (_req, res) => {
    res.sendFile('./src/views/notifications.html', { root: '.' });
  });
};
