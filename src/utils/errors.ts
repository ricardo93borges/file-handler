import { ErrorCode } from "@/utils";

export abstract class CustomError {
  constructor(
    readonly code: ErrorCode,
    readonly message: string,
    readonly httpStatusCode: number
  ) {}
}

export class InternalServerError extends CustomError {
  constructor(code: ErrorCode, message: string, httpStatusCode = 500) {
    super(code, message, httpStatusCode);
  }
}

export class ResourceNotFound extends CustomError {
  constructor(code: ErrorCode, message: string, httpStatusCode = 404) {
    super(code, message, httpStatusCode);
  }
}

export class BadRequest extends CustomError {
  constructor(code: ErrorCode, message: string, httpStatusCode = 400) {
    super(code, message, httpStatusCode);
  }
}
