import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { ReqRes } from "express.type";

interface MultParams extends ReqRes {
  maxSizeMB?: number;
  maxFiles?: number;
  allowedType?: string[];
}

const _upload = multer({
  storage: multer.diskStorage({
    destination: (
      req: express.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      cb(null, "uploads/");
    },
    filename: (
      req: express.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      const ext = path.extname(file.originalname);
      const fileName: string = uuidv4();
      cb(null, `UPLOADS-${fileName}${ext}`);
    },
  }),
});

const uploadMultiple = ({
  req,
  res,
  next,
  maxFiles,
  maxSizeMB,
  allowedType,
}: MultParams) => {
  _upload.array("files", maxFiles ?? 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    const files: Express.Multer.File[] | any = req.files;
    const errors: any[] = [];
    if (!files) {
      errors.push({
        error_code: "file-files-required",
        message: `(files) are required`,
      });
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    files.forEach((file: Express.Multer.File | any) => {
      const allowedTypes: string[] = allowedType ?? [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/heic",
        "image/heif",
      ];
      const maxSize = maxSizeMB ? maxSizeMB * 1024 * 1024 : 5 * 1024 * 1024;
      if (!allowedTypes.includes(file.mimetype)) {
        errors.push({
          error_code: "file-invalid",
          message: `Invalid file type: (${file.originalname}<---->${file.mimetype})`,
        });
      }
      if (file.size > maxSize) {
        errors.push({
          error_code: "file-too-large",
          message: `File too large: ${file.originalname}`,
        });
      }
    });
    if (errors.length > 0) {
      files.forEach((file: Express.Multer.File | any) => {
        fs.unlinkSync(file.path);
      });
      return res.status(400).json({ errors });
    }
    req.files = files;
    next();
    return;
  });
};

export default {
  uploadMultiple,
};
