import { Request, Response } from "express";
import { Controller } from "./Controller";
import { CacheManagerService, FileHandlerService } from "@/services";
import { ErrorCode } from "@/utils";

type Validation = {
  isValid: boolean;
  httpStatusCode?: number;
  code?: string;
  message?: string;
};

export class FileController extends Controller {
  private readonly filesProcessingKey = "FILES_PROCESSING";

  constructor(
    private readonly fileHandlerService: FileHandlerService,
    private readonly cacheManagerService: CacheManagerService,
    private readonly maxConcurrentProcess: number
  ) {
    super();
  }

  async decreaseFilesProcessing(): Promise<void> {
    const filesProcessing = await this.getFilesProcessing();
    const value = filesProcessing > 1 ? filesProcessing - 1 : 0;
    await this.cacheManagerService.set(this.filesProcessingKey, value);
  }

  async increaseFilesProcessing(): Promise<void> {
    const filesProcessing = await this.getFilesProcessing();
    const value = filesProcessing ? filesProcessing + 1 : 1;
    await this.cacheManagerService.set(this.filesProcessingKey, value);
  }

  async getFilesProcessing(): Promise<number> {
    return this.cacheManagerService.get(this.filesProcessingKey);
  }

  async validate(fileSize: number): Promise<Validation> {
    const filesProcessing = await this.getFilesProcessing();
    console.log("filesProcessing", filesProcessing);

    if (filesProcessing) {
      if (filesProcessing > this.maxConcurrentProcess) {
        return {
          isValid: false,
          httpStatusCode: 503,
          code: ErrorCode.SERVICE_UNAVAILABLE,
          message: "service unavailable",
        };
      }
    }

    const isValid = this.fileHandlerService.validate(fileSize);
    if (!isValid) {
      return {
        isValid: false,
        httpStatusCode: 400,
        code: ErrorCode.BAD_REQUEST_ERROR,
        message: "File too large. Max file size allowed: 50MB",
      };
    }

    return { isValid: true };
  }

  uploadFile = async (req: Request, res: Response) => {
    try {
      const fileSize = parseInt(req.headers["content-length"]!, 10);
      const { isValid, httpStatusCode, code, message } = await this.validate(
        fileSize
      );

      if (!isValid) {
        await this.decreaseFilesProcessing();
        return res.status(httpStatusCode!).send({ code, message });
      }

      await this.increaseFilesProcessing();

      this.fileHandlerService.upload(req, res, async (err) => {
        if (err) {
          console.error(err);

          await this.decreaseFilesProcessing();

          res.status(500).send({
            code: ErrorCode.INTERNAL_SERVER_ERROR,
            message: "internal server error",
          });
        } else {
          await this.decreaseFilesProcessing();

          res.status(204).send();
        }
      });
    } catch (err) {
      this.handleExceptions(res, err);
    }
  };
}
