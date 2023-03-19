import { Request, Response } from "express";
import { Controller } from "./Controller";
import { CacheManagerService, FileHandlerService } from "@/services";
import { BadRequest, ErrorCode, ServiceUnavailable } from "@/utils";

export class FileController extends Controller {
  readonly filesProcessingKey = "FILES_PROCESSING";

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

  async validate(fileSize: number): Promise<boolean> {
    const filesProcessing = await this.getFilesProcessing();

    if (filesProcessing) {
      if (filesProcessing >= this.maxConcurrentProcess) {
        throw new ServiceUnavailable();
      }
    }

    const isValid = this.fileHandlerService.validate(fileSize);
    if (!isValid) {
      throw new BadRequest("File too large. Max file size allowed: 50MB");
    }

    return true;
  }

  uploadFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const fileSize = parseInt(req.headers["content-length"]!, 10);

      await this.validate(fileSize);

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
      await this.decreaseFilesProcessing();
      this.handleExceptions(res, err);
    }
  };
}
