import { RequestHandler } from "express";
import multer, { StorageEngine } from "multer";

export class FileHandlerService {
  upload: RequestHandler;

  constructor(
    private readonly maxFileSize: number,
    private readonly fileField: string,
    private readonly fileDestination: string
  ) {
    this.upload = multer({ storage: this.setupStorage() }).single(
      this.fileField
    );
  }

  validate(fileSize: number): boolean {
    if (fileSize > this.maxFileSize) {
      return false;
    }
    return true;
  }

  setupStorage(): StorageEngine {
    const destination = this.fileDestination;
    const storage = multer.diskStorage({
      destination: function (_, file, cb) {
        cb(null, destination);
      },
      filename: function (_, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
      },
    });

    return storage;
  }
}
