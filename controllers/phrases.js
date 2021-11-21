const handleFetchPhrases = (req, res, conn) => {
  const queryString = `SELECT * FROM phrases 
    WHERE user_id = ${req.user.id} 
    AND NOT complete`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.json({
      status: 'success',
      result
    });
  });
}

const handleInsertPhrase = (req, res, conn) => {
  const { phrase } = req.body;
  const queryString = `INSERT INTO phrases 
    (value, user_id) 
    VALUES("${phrase}","${req.user.id}")`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.json({
      status: 'success',
      result
    });
  });
}

const handleUpdatePhrase = (req, res, conn) => {
  const { id, phrase, complete } = req.body;
  const queryString = `UPDATE phrases SET 
    value="${phrase}", 
    complete="${complete}" 
    WHERE id ="${id}" 
    AND user_id = ${req.user.id}`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.json({
      status: 'success',
      result
    });
  });
}

module.exports = {
  handleFetchPhrases,
  handleInsertPhrase,
  handleUpdatePhrase
}