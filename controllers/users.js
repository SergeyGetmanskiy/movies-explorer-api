const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const AuthError = require('../errors/AuthError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflctError');
const NotFoundError = require('../errors/NotFoundError');

const {
  emailOrPasswordEmptyMsg,
  userAlreadyExistsMsg,
  incorrectUserInputMsg,
  incorrectUserUpdateMsg,
  incorrectEmailOrPasswordMsg,
} = require('../constants/errorMessages');

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError(emailOrPasswordEmptyMsg);
  }
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(userAlreadyExistsMsg));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${incorrectUserInputMsg} ${err.message}`));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(userAlreadyExistsMsg));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(incorrectUserUpdateMsg));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError(incorrectEmailOrPasswordMsg));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError(incorrectEmailOrPasswordMsg));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret', { expiresIn: '1d' });
          return res.status(200).send({ token });
        });
    })
    .catch(next);
};
