class AppError extends Error {
  constructor(errorCode, message, statusCode, detail = null) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.detail = detail;
  }
}
export default AppError;
