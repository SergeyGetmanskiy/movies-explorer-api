const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const AuthError = require('../errors/AuthError');

const {
  authRequiredMsg,
  authErrorMsg,
} = require('../constants/errorMessages');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError(authRequiredMsg);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new AuthError(authErrorMsg));
    }
    next(err);
  }
  req.user = payload;

  next();
};
