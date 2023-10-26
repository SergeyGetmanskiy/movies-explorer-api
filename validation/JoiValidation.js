const { celebrate, Joi } = require('celebrate');

module.exports.signupSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.signinSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.userSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports.movieSchema = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/https?:\/\/w?w?w?.+/i),
    trailerLink: Joi.string().required().pattern(/https?:\/\/w?w?w?.+/i),
    thumbnail: Joi.string().required().pattern(/https?:\/\/w?w?w?.+/i),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().pattern(/\w/i),
    nameEN: Joi.string().required().pattern(/\w/i),
  }),
});

module.exports.movieIdSchema = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});
