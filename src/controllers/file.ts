import { Request, Response } from "express";
import { Controller } from "./Controller";
import { FileHandlerService } from "@/services";
import { ErrorCode } from "@/utils";

export class FileController extends Controller {
  constructor(private readonly fileHandlerService: FileHandlerService) {
    super();
  }

  uploadFile = async (req: Request, res: Response) => {
    try {
      const fileSize = parseInt(req.headers["content-length"]!, 10);
      const isValid = this.fileHandlerService.validate(fileSize);
      if (!isValid) {
        res
          .status(400)
          .send({ error: "File too large. Max file size allowed: 50MB" });
      } else {
        this.fileHandlerService.upload(req, res, (err) => {
          if (err) {
            console.error(err);

            res.status(500).send({
              code: ErrorCode.INTERNAL_SERVER_ERROR,
              message: "internal server error",
            });
          } else {
            res.status(204).send();
          }
        });
      }
    } catch (err) {
      this.handleExceptions(res, err);
    }
  };
}
