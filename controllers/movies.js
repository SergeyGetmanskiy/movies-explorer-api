const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const ForbiddenRequestError = require('../errors/ForbiddenRequestError');
const NotFoundError = require('../errors/NotFoundError');

const {
  incorrectMovieInputMsg,
  movieNotFoundMsg,
  cannotDeleteMovieMsg,
  incorrectDeleteMovieInputMsg,
} = require('../constants/errorMessages');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    owner: req.user._id,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${incorrectMovieInputMsg} ${err.message}`));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findByIdAndRemove(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        return Promise.reject(new NotFoundError(movieNotFoundMsg));
      }
      if (movie.owner.toString() !== req.user._id) {
        return Promise.reject(new ForbiddenRequestError(cannotDeleteMovieMsg));
      }
      return res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(incorrectDeleteMovieInputMsg));
      }
      next(err);
    });
};
