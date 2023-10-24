const express = require('express');

require('dotenv').config();

const bodyParser = require('body-parser');

const app = express();

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const helmet = require('helmet');

const cors = require('./middlewares/cors');

const { NODE_ENV, PORT = 3000, DATABASE_URL } = process.env;
const { dataBaseUrl } = require('./config/config');

const { errorHandler } = require('./errors/errorHandler');

const routes = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { ratelimiter } = require('./middlewares/ratelimiter');

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : dataBaseUrl, {
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

app.use(cors);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(ratelimiter);

app.use(routes);

app.use(requestLogger);
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
