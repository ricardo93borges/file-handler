import { ErrorCode } from "@/utils";

export abstract class CustomError {
  constructor(
    readonly code: ErrorCode,
    readonly message: string,
    readonly httpStatusCode: number
  ) {}
}

export class InternalServerError extends CustomError {
  constructor() {
    super(ErrorCode.INTERNAL_SERVER_ERROR, "internal server error", 500);
  }
}

export class ResourceNotFound extends CustomError {
  constructor(message: string) {
    super(ErrorCode.NOT_FOUND_ERROR, message, 404);
  }
}

export class BadRequest extends CustomError {
  constructor(message: string) {
    super(ErrorCode.BAD_REQUEST_ERROR, message, 400);
  }
}

export class ServiceUnavailable extends CustomError {
  constructor() {
    super(ErrorCode.SERVICE_UNAVAILABLE, "service unavailable", 503);
  }
}
