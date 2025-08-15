import multer from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage(); 

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'poster' && !file.mimetype.startsWith('image/')) {
    return cb(new Error('Poster must be an image'));
  }
  if (file.fieldname === 'movieFile' && file.mimetype !== 'video/mp4') {
    return cb(new Error('Movie file must be MP4'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});