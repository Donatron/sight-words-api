const handleFetchUser = (req, res, conn) => {
  const { userName, email } = req.body;
  const queryString = `SELECT * FROM user 
    WHERE username = "${userName}" 
    OR email = "${email}"`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.send(result);
  });
}

module.exports = {
  handleFetchUser
}