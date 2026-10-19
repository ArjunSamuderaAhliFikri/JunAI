/** @format */

/**
 * Standardized API response helper.
 * Ensures consistent response format across all endpoints.
 */

const sendSuccess = (res, { data = null, message = "Success", statusCode = 200, meta = null }) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, { message = "Internal Server Error", statusCode = 500, errors = null }) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const sendPaginated = (res, { data, total, page, limit, message = "Success" }) => {
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
