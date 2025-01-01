const ApiError = require("../utils/apiError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 500,
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
