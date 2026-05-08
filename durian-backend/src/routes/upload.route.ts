import { Router } from 'express';

import { uploadAudio } from '../controllers/upload.controller';
import { uploadAudioMiddleware } from '../middlewares/upload.middleware';

const uploadRouter = Router();

uploadRouter.post('/', uploadAudioMiddleware, uploadAudio);

export default uploadRouter;
