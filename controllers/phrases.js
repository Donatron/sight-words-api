const handleFetchPhrases = (req, res, conn) => {
  const { userId } = req.body;
  const queryString = `SELECT * FROM phrases 
    WHERE user_id = ${userId} 
    AND NOT complete`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.send(result);
  });
}

const handleInsertPhrase = (req, res, conn) => {
  const { userId, phrase } = req.body;
  const queryString = `INSERT INTO phrases 
    (value, user_id) 
    VALUES("${phrase}","${userId}")`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.send(result);
  });
}

const handleUpdatePhrase = (req, res, conn) => {
  const { id, userId, phrase, complete } = req.body;
  const queryString = `UPDATE phrases SET 
    value="${phrase}", 
    complete="${complete}" 
    WHERE id ="${id}" 
    AND user_id = ${userId}`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.send(result);
  });
}

module.exports = {
  handleFetchPhrases,
  handleInsertPhrase,
  handleUpdatePhrase
}