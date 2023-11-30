const express = require('express');
const mongoose = require('mongoose');
const { signUpValidator, signInValidator } = require('./middlewares/validator');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { checkAuth } = require('./middlewares/auth');
const app = express();
const { json } = require('express');
const { login, createUser } = require('./controllers/users');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');

app.use(cors());
app.use(json());
app.use(requestLogger);

app.post('/signin', signInValidator, login);
app.post('/signup', signUpValidator, createUser);

app.use(checkAuth);

app.use('/cards', cardRouter);
app.use('/users', userRouter);
app.use('/', (req, res, next) => {
  next(res.status(404).send({
    message: 'Невозможно отобразить страницу',
  }));
});

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = ServerError } = err;
  const message = statusCode === ServerError ? 'На сервере произошла ошибка.' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);