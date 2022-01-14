const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const phrasesRouter = require('./routes/phrasesRoutes');
const sightWordsRouter = require('./routes/sightWordsRoutes');
const userRouter = require('./routes/userRoutes');

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.json({
  limit: '10kb'
}));
app.use(mongoSanitize());
app.use(cors());

const limiter = rateLimit({
  windowMS: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: 'Too many requests from this IP address. Please try again in 1 hour'
});

app.use('/', limiter);
app.use(xss());
app.use(hpp());


app.use('/sight-words', sightWordsRouter);
app.use('/phrases', phrasesRouter);
app.use('/users', userRouter);

app.use(compression();

app.all('/*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;