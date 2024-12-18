import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.js';
import { UploadMiddleware } from '../middlewares/upload.js';
import { UploadController } from '../controllers/upload.js';

/** @param {Router} appRouter */
export default (appRouter) => {
  const router = Router();

  appRouter.use('/upload', router);

  router.post(
    '/image',
    AuthMiddleware.isAuthorized,
    UploadMiddleware.parseImage,
    UploadMiddleware.uploadToImageKit,
    UploadController.uploadImage
  );
};
