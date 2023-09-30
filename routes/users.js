const router = require('express').Router();

const {
  getUser,
  updateUser,
} = require('../controllers/users');

const {
  userSchema,
} = require('../validation/JoiValidation');

router.get('/me', getUser);

router.patch('/me', userSchema, updateUser);

module.exports = router;
