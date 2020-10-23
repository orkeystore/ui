export interface IHttpRequestErrorInfo {
  statusCode: number;
  message: string;
}

export class HttpRequestError extends Error {
  constructor (public status: number, public message: string) {
    super(message);
    Object.setPrototypeOf(this, HttpRequestError.prototype);
  }

  getInfo(): IHttpRequestErrorInfo {
    return {
      statusCode: this.status,
      message: this.message,
    };
  }
}
