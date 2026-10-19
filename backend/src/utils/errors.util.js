/** @format */

/**
 * Custom application error class.
 * Extends native Error with HTTP status code support.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} tidak ditemukan`, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = "Data tidak valid") {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Tidak memiliki akses") {
    super(message, 401);
  }
}

class ConflictError extends AppError {
  constructor(message = "Data sudah ada") {
    super(message, 409);
  }
}

module.exports = { AppError, NotFoundError, ValidationError, UnauthorizedError, ConflictError };
