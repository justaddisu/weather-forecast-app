export function notFoundMiddleware(req, res) {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`,
  });
}

export function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    message: error.message || "Something went wrong",
    details: error.details || null,
  });
}
