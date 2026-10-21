
module.exports = (err, req, res, next) => {
  console.error(err);

  // If Express has already started sending a response,
  // let its default error handler finish.
  if (res.headersSent) {
    return next(err);
  }

  // Invalid JSON submitted by the client.
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    'body' in err
  ) {
    return res.status(400).json({
      message: 'Invalid JSON in request body.',
    });
  }

  // Invalid data supplied to a Mongoose operation.
  if (
    err.name === 'ValidationError' ||
    err.name === 'CastError'
  ) {
    return res.status(400).json({
      message: 'Invalid data supplied.',
    });
  }

  const statusCode = err.statusCode || err.status;

  // Only use client-error status codes provided by the error.
  const status =
    Number.isInteger(statusCode) &&
    statusCode >= 400 &&
    statusCode < 500
      ? statusCode
      : 500;

  res.status(status).json({
    message:
      status === 500
        ? 'Server error'
        : err.message || 'Request failed',
  });
};
