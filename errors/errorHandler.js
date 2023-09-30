const { serverErrorMsg } = require('../constants/errorMessages');

module.exports.errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? serverErrorMsg : message });
};
