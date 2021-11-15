const express = require('express');
const mysql = require('mysql');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var connection = mysql.createConnection({
  host: 'localhost',
  port: "8889",
  user: 'root',
  password: 'root',
  database: 'sight_words'
});

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.get("/", (req, res) => {
  connection.query('SELECT * FROM user', (err, result, fields) => {
    if (err) throw err;

    res.send(result);
  })
});

app.get("/user", (req, res) => {
  const { userName, email } = req.body;
  const queryString = `SELECT * FROM user WHERE username = "${userName}" OR email = "${email}"`;

  connection.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.send(result);
  });
});

app.get("/sight-words", (req, res) => {
  const { userId } = req.body;
  const queryString = `SELECT * FROM words WHERE user_id = ${userId} AND NOT complete`;

  connection.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.send(result);
  });
});

app.get("/phrases", (req, res) => {
  const { userId } = req.body;
  const queryString = `SELECT * FROM phrases WHERE user_id = ${userId} AND NOT complete`;

  connection.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});