const express = require('express');
const authMiddleware = require('./middleware/auth');
const cors = require('cors');

const app = express();

const authController = require('./controllers/auth');
const userController = require('./controllers/user');

const phrasesRouter = require('./routes/phrasesRoutes');
const sightWordsRouter = require('./routes/sightWordsRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// User / Auth routes
app.get("/user", authMiddleware, (req, res) => userController.handleFetchUser(req, res, conn));
app.post("/login", (req, res) => authController.handleLogin(req, res, conn));
app.post("/register", (req, res) => authController.handleRegister(req, res, conn));

app.use('/sight-words', sightWordsRouter);
app.use('/phrases', phrasesRouter);

module.exports = app;