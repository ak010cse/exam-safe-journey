import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);

  if (err.message.includes('Validation')) {
    res.status(400).json({
      error: err.message,
      statusCode: 400,
    });
  } else if (err.message.includes('Not found')) {
    res.status(404).json({
      error: err.message,
      statusCode: 404,
    });
  } else {
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500,
      ...(process.env.NODE_ENV === 'development' && { details: err.message }),
    });
  }
}

/**
 * Middleware to handle 404 routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
}
