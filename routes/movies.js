const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  movieSchema,
  movieIdSchema,
} = require('../validation/JoiValidation');

router.get('/', getMovies);

router.post('/', movieSchema, createMovie);

router.delete('/:movieId', movieIdSchema, deleteMovie);

module.exports = router;
