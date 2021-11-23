const jwt = require('jsonwebtoken');

const handleFetchUser = (req, res, conn) => {
  const decoded = jwt.verify(req.header('x-auth-token'), process.env.JWT_SECRET);

  const queryString = `SELECT id, username FROM user 
    WHERE id = "${decoded.user.id}" `;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.send(result);
  });
}

module.exports = {
  handleFetchUser
}