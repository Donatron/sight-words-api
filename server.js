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

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
})