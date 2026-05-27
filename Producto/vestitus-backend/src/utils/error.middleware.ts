import { NextFunction, Request, Response } from 'express';
import config from '@config';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (config.nodeEnv !== 'production') {
    console.error(err);
  } else {
    console.error(`Error: ${err.name} - ${err.message}`);
  }

  const statusCode = (err as any).statusCode || 500;
  const isUserError = statusCode < 500;

  const message = isUserError
    ? err.message
    : config.nodeEnv === 'production'
      ? 'Error interno del servidor'
      : err.message;

  res.status(statusCode).json({
    success: false,
    message
  });
};
