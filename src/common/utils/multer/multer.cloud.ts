import multer from 'multer';
import type { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import { storageTypeEnum } from '../../enums';
import { fileValidation } from './multer.validation';
import os from 'os';

export const multerCloud = (  { 
    fileType = fileValidation.image,
    storageType = storageTypeEnum.memory,
  }: {
    fileType?: string[],
    storageType?: storageTypeEnum
  }
) => {
  return {
    storage: storageType === storageTypeEnum.memory ? multer.memoryStorage() : multer.diskStorage({
      destination: os.tmpdir(),
      filename(req: Request, file: Express.Multer.File, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
      }
    }),

   fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
      if (fileType.includes(file.mimetype)) {
        (cb(null, true))
      } else return cb(new BadRequestException('Invalid file type'));
    }

  }
}

