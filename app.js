const express = require('express');
const cors = require('cors');

const app = express();

const phrasesRouter = require('./routes/phrasesRoutes');
const sightWordsRouter = require('./routes/sightWordsRoutes');
const userRouter = require('./routes/userRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/sight-words', sightWordsRouter);
app.use('/phrases', phrasesRouter);
app.use('/users', userRouter);

module.exports = app;