const router = require('express').Router();

const { signinSchema, signupSchema } = require('../validation/JoiValidation');

const { login, createUser } = require('../controllers/users');

const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');

const { pageNotFoundMsg } = require('../constants/errorMessages');

router.post('/signup', signupSchema, createUser);
router.post('/signin', signinSchema, login);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError(pageNotFoundMsg));
});

module.exports = router;
