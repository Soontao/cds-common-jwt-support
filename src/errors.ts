
class HttpError extends Error {

  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }

}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, 401);
  }
}
