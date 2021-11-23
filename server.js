const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/auth');
const cors = require('cors');

dotenv.config({ path: './config.env' });
const app = express();

const authController = require('./controllers/auth');
const sightwordsController = require('./controllers/sightwords');
const phrasesController = require('./controllers/phrases');
const userController = require('./controllers/user');

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

var conn = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

conn.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + conn.threadId);
});

app.get("/", (req, res) => {
  res.send('Connected');
});

app.get("/sight-words", authMiddleware, (req, res) => sightwordsController.handleFetchSightWords(req, res, conn));
app.post("/sight-words-insert", authMiddleware, (req, res) => sightwordsController.handleInsertSightWord(req, res, conn));
app.put("/sight-words-update", authMiddleware, (req, res) => sightwordsController.handleUpdateSightWord(req, res, conn));
app.get("/phrases", authMiddleware, (req, res) => phrasesController.handleFetchPhrases(req, res, conn));
app.post("/phrases-insert", authMiddleware, (req, res) => phrasesController.handleInsertPhrase(req, res, conn));
app.put("/phrases-update", authMiddleware, (req, res) => phrasesController.handleUpdatePhrase(req, res, conn));
app.get("/user", authMiddleware, (req, res) => userController.handleFetchUser(req, res, conn));
app.post("/login", (req, res) => authController.handleLogin(req, res, conn));
app.post("/register", (req, res) => authController.handleRegister(req, res, conn));

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});