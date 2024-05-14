import { Response } from "express";

class WebError {
  status: number;
  error: any;

  constructor(status: number, error: any) {
    this.status = status;
    this.error = error;
  }
}

export class Unprocessable extends WebError {
  constructor(error?: any) {
    super(422, error);
  }
}

export class Conflict extends WebError {
  constructor(error?: any) {
    super(409, error);
  }
}

export class NotFound extends WebError {
  constructor(error?: any) {
    super(404, error);
  }
}

export class Forbidden extends WebError {
  constructor(error?: any) {
    super(403, error);
  }
}

export class Unauthorized extends WebError {
  constructor(error?: any) {
    super(401, error);
  }
}

export class BadRequest extends WebError {
  constructor(error?: any) {
    super(400, error);
  }
}

export class InternalError extends WebError {
  constructor(error?: any) {
    super(500, error);
  }
}

class ErrorUtils {
  static catchError(res: Response, error: any) {
    console.log(error);
    return res.status(error.status || 500).json(error);
  }
}

export default ErrorUtils;