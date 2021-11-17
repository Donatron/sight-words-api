const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const handleLogin = (req, res, conn) => {
  const { userName, password } = req.body;
  if (!userName || !password) res.status(400).json('Wrong username or password');

  let user;

  conn.query(`SELECT * FROM user
    WHERE username="${userName}" OR email="${userName}"`, (err, result, fields) => {
    if (err) throw err;
    user = result;

    if (password !== user[0].password) res.status(400).json('Wrong username or password');
    res.send('Login Success');
  });
}

const handleRegister = (req, res, conn) => { }

module.exports = {
  handleLogin
}