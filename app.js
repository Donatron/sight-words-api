const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const phrasesRouter = require('./routes/phrasesRoutes');
const sightWordsRouter = require('./routes/sightWordsRoutes');
const userRouter = require('./routes/userRoutes');

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/sight-words', sightWordsRouter);
app.use('/phrases', phrasesRouter);
app.use('/users', userRouter);

app.all('/*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;