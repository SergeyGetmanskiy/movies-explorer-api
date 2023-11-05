const router = require('express').Router();

const {
  getMovies,
  createMovie,
  updateMovie,
} = require('../controllers/movies');

const {
  movieSchema,
  movieIdSchema,
} = require('../validation/JoiValidation');

router.get('/', getMovies);

router.post('/', movieSchema, createMovie);

router.delete('/:cardId', movieIdSchema, updateMovie);

module.exports = router;
