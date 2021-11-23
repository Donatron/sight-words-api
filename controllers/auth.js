const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const handleLogin = (req, res, conn) => {
  const { email, password } = req.body;
  if (!email || !password) res.status(400).json('Wrong signin credentials.');

  let user;

  conn.query(`SELECT * FROM login
    WHERE email="${email}"`, async (err, result, fields) => {
    if (err) throw err;
    user = result[0];

    if (user) {
      try {
        await bcrypt.compare(password, user.hash, (err, response) => {
          if (err) throw err;

          if (response) {
            const payload = {
              user: {
                id: user.user_id
              }
            }

            jwt.sign(
              payload,
              process.env.JWT_SECRET,
              {
                expiresIn: '1 day'
              },
              (err, token) => {
                if (err) throw err;

                res.json({ status: 'success', token })
              }
            );
          } else {
            res.json({
              status: 'error',
              message: 'Incorrect password'
            });
          }
        })
      } catch (err) {
        res.json({
          status: 'error',
          message: 'Unable to process login at the moment'
        })
      }
    } else {
      res.json({
        status: 'error',
        message: 'User not found'
      });
    }
  });
}

const handleRegister = (req, res, conn) => {
  const { userName, email, password } = req.body;

  const isValidEmail = validator.isEmail(email);
  const isValidUserName = validator.isLength(userName, { min: 3, max: 20 });

  if (!isValidEmail || !isValidUserName) {
    res.status(400).json({
      status: 'error',
      message: 'Please enter a valid email, and a user name between 3 and 20 characters'
    })
  }

  const userQuery = `INSERT INTO user(email, username) values("${email}","${userName}")`;

  conn.query(userQuery, async (err, result, fields) => {
    if (err && err.code === 'ER_DUP_ENTRY') res.status(400).json({ message: "User name or email already in use" });
    if (err) throw err;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const registeredUserId = result.insertId;

    const loginQuery = `INSERT INTO login(user_id, email, hash) VALUES ("${registeredUserId}","${email}","${hash}")`;

    conn.query(loginQuery, (err, result, fields) => {
      if (err) throw (err);

      conn.query(`SELECT id FROM user WHERE email = "${email}"`, (err, result, fields) => {
        if (err) throw err;

        const payload = {
          user: {
            id: registeredUserId
          }
        }

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: '1 day'
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