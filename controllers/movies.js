const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const {
  movieCreatedMsg,
  movieLikedMsg,
  movieDislikedMsg,
} = require('../constants/serverResponseMessages');

const {
  incorrectMovieInputMsg,
  movieNotFoundMsg,
  incorrectInputDataforLikeMsg,
  incorrectInputDataforDislikeMsg,
} = require('../constants/errorMessages');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ likes: req.user._id })
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
  Movie.findOne({ movieId })
    .then((found) => {
      if (!found) {
        return Movie.create({
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
          likes: [req.user._id],
        })
          .then((movie) => res.status(201).send({ movie, message: movieCreatedMsg }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequestError(`${incorrectMovieInputMsg} ${err.message}`));
            }
            next(err);
          });
      }
      return Movie.findOneAndUpdate(
        { movieId },
        { $addToSet: { likes: req.user._id } },
        { new: true },
      )
        .orFail(new NotFoundError(movieNotFoundMsg))
        .then((movie) => res.status(200).send({ movie, message: movieLikedMsg }))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError(incorrectInputDataforLikeMsg));
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports.updateMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError(movieNotFoundMsg))
    .then((movie) => res.status(200).send({ movie, message: movieDislikedMsg }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(incorrectInputDataforDislikeMsg));
      }
      next(err);
    });
};
