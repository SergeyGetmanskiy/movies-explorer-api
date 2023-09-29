const express = require('express');

require('dotenv').config();

const bodyParser = require('body-parser');

const app = express();

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const helmet = require('helmet');

const { PORT, DATABASE_URL } = require('./config/config');

const { errorHandler } = require('./errors/errorHandler');

const routes = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { ratelimiter } = require('./middlewares/ratelimiter');

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

app.use(routes);

app.use(errors());
app.use(errorHandler);

app.use(ratelimiter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
