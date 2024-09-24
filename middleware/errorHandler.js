import AppError from "../utils/AppError.js";

const errorHandler = (error, req, res, next) => {
  if (error.isJoi) {
    error.statusCode = 400; // Bad request
    error.message = error.details[0].message; // Get the validation error message
    return res.status(error.statusCode).json({
      status: "failed",
      message: error.message,
    });
  }
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "failed",
      message: error.message,
    });
  }
  return res.status(400).json(error.message);
};

export default errorHandler;
