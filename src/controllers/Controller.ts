import { Response } from "express";
import { CustomError } from "@/utils/errors";
import { ErrorCode } from "@/utils/error-codes";

export class Controller {
  handleExceptions(res: Response, err: any) {
    console.error(err);

    if (err instanceof CustomError) {
      res.status(err.httpStatusCode).send({
        error: err.code,
        message: err.message,
      });
    } else {
      res.status(500).send({
        error: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "internal server error",
      });
    }
  }
}
