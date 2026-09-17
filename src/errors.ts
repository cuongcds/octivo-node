/** Base error for all errors raised by the SDK. */
export class OctivoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OctivoError';
  }
}

/**
 * Thrown client-side, before any request is sent, when required fields are
 * missing (neither email nor phone supplied).
 */
export class ValidationError extends OctivoError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Thrown when the API responds with an error (invalid source_id, invalid
 * phone/email, reCAPTCHA failure, ...). Carries the raw decoded response body.
 */
export class ApiError extends OctivoError {
  readonly statusCode: number;
  readonly responseBody: Record<string, unknown>;

  constructor(message: string, statusCode: number, responseBody: Record<string, unknown> = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}
