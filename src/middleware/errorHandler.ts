import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Ups...An unexpected error occurred";

  console.error(`Exception: ${message}, stack: ${err.stack}`);

  res.status(status).json({
    status,
    timestamp: new Date().toISOString(),
    message,
    path: req.originalUrl,
  });
};

export default errorHandler;
