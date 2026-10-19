/** @format */

const { AppError } = require("../utils/errors.util");
const { sendError } = require("../utils/response.util");

/**
 * Global error handler middleware.
 * Handles both operational (AppError) and unexpected errors.
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  } else {
    console.error("❌ Error:", err.message);
  }

  // Handle Prisma known errors
  if (err.code === "P2002") {
    return sendError(res, {
      message: `Data duplikat ditemukan pada field: ${err.meta?.target?.join(", ")}`,
      statusCode: 409,
    });
  }

  if (err.code === "P2025") {
    return sendError(res, {
      message: "Data yang diminta tidak ditemukan",
      statusCode: 404,
    });
  }

  // Handle AppError (operational errors)
  if (err instanceof AppError) {
    return sendError(res, {
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  // Handle JSON parse errors
  if (err.type === "entity.parse.failed") {
    return sendError(res, {
      message: "Format JSON tidak valid",
      statusCode: 400,
    });
  }

  // Default: unexpected error
  return sendError(res, {
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
    statusCode: 500,
  });
};

module.exports = { errorHandler };
