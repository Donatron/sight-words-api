const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

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

const handleRegister = (req, res, conn) => {
  const { userName, email, password } = req.body;

  const isValidEmail = validator.isEmail(email);
  const isValidUserName = validator.isLength(userName, { min: 3, max: 20 });

  if (!isValidEmail || !isValidUserName) {
    res.status(400).json({
      message: 'Please enter a valid email, and a user name between 3 and 20 characters'
    })
  }


  const userQuery = `INSERT INTO user(email, username) values("${email}","${userName}")`;

  // Check for username, email
  conn.query(userQuery, async (err, result, fields) => {
    if (err && err.code === 'ER_DUP_ENTRY') res.status(400).json({ message: "User name or email already in use" });
    if (err) throw err;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const loginQuery = `INSERT INTO login(email, hash) VALUES ("${email}","${hash}")`;

    conn.query(loginQuery, (err, result, fields) => {
      if (err) throw (err);


      conn.query(`SELECT id FROM user WHERE email = "${email}"`, (err, result, fields) => {
        if (err) throw err;

        const payload = {
          user: {
            id: result[0].id
          }
        }

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: 36000
          },
          (err, token) => {
            if (err) throw err;

            res.json({ token })
          }
        )
      })
    })
  })
}

module.exports = {
  handleLogin,
  handleRegister
}