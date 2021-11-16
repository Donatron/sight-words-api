const express = require('express');
const mysql = require('mysql');
const app = express();

const sightwords = require('./controllers/sightwords');
const phrases = require('./controllers/phrases');
const user = require('./controllers/user');

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var conn = mysql.createConnection({
  host: 'localhost',
  port: "8889",
  user: 'root',
  password: 'root',
  database: 'sight_words'
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

app.get("/sight-words", (req, res) => sightwords.handleFetchSightWords(req, res, conn));
app.get("/sight-words-insert", (req, res) => sightwords.handleInsertSightWord(req, res, conn));
app.get("/sight-words-update", (req, res) => sightwords.handleUpdateSightWord(req, res, conn));
app.get("/phrases", (req, res) => phrases.handleFetchPhrases(req, res, conn));
app.get("/phrases-insert", (req, res) => phrases.handleInsertPhrase(req, res, conn));
app.get("/phrases-update", (req, res) => phrases.handleUpdatePhrase(req, res, conn));
app.get("/user", (req, res) => user.handleFetchUser(req, res, conn));

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});