const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}

// TODO: Pad this out to handle production errors
const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: 'This is a production error'
  });
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {

    sendErrorProd(err, res);
  }

  next();
}