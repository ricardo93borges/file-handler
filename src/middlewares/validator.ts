import { Schema } from "joi";
import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "@/utils/error-codes";

export const validator = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req, { allowUnknown: true });

    if (error) {
      res.status(400).send({
        error: ErrorCode.BAD_REQUEST_ERROR,
        message: error.details.map((d) => d.message),
      });
    } else {
      next();
    }
  };
};
