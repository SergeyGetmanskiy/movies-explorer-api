const express = require('express');

require('dotenv').config();

const bodyParser = require('body-parser');

const app = express();

const { PORT = 3000, DATABASE_URL = 'mongodb://127.0.0.1:27017/movies-explorer-db' } = process.env;

const helmet = require('helmet');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const { signinSchema, signupSchema } = require('./validation/JoiValidation');

const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/NotFoundError');

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
})
  .then(
    () => {
      console.log('Connected to MongoDB');
    },
    (err) => {
      console.log(`Ошибка ${err}`);
    },
  );

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(errorLogger);

app.post('/signup', signupSchema, createUser);
app.post('/signin', signinSchema, login);

app.use('/users', auth, require('./routes/users'));
app.use('/movies', auth, require('./routes/movies'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не существует.'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
