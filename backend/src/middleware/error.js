import { env } from '../config/env.js';

/**
 * Global Express error handler.
 * Must be registered last in app.js: app.use(errorHandler)
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log full error in development
  if (env.NODE_ENV === 'development') {
    console.error(`[${req.method}] ${req.path} — ${status}:`, err);
  }

  res.status(status).json({
    error: message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 handler — mount before errorHandler in app.js
 */
export const notFound = (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
};
