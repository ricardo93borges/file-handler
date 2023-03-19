import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "@/utils";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const credentials = { user: "admin", password: "admin" };
  const auth = req.headers.authorization;

  if (auth) {
    const [user, password] = Buffer.from(auth.split(" ")[1], "base64")
      .toString()
      .split(":");

    if (user === credentials.user && password === credentials.password) {
      return next();
    }
  }

  res.status(401).send({
    error: ErrorCode.UNAUTHORIZED_ERROR,
    message: "unauthorized",
  });
};
