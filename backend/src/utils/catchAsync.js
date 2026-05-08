/**
 * Wrapper for async controller functions to catch errors and pass them to express error handler
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export { catchAsync };
