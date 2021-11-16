const handleFetchSightWords = (req, res, conn) => {
  const { userId } = req.body;
  const queryString = `SELECT * FROM words 
    WHERE user_id = ${userId} 
    AND NOT complete`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.send(result);
  });
}

const handleInsertSightWord = (req, res, conn) => {
  const { userId, word, syllables } = req.body;
  const queryString = `INSERT INTO words 
    (user_id, value, syllables) 
    VALUES("${userId}","${word}","${syllables}")`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.send(result);
  });
}

const handleUpdateSightWord = (req, res, conn) => {
  const { id, userId, word, syllables, complete } = req.body;
  const queryString = `UPDATE words SET 
    value="${word}", 
    syllables="${syllables}", 
    complete="${complete}" 
    WHERE id ="${id}" 
    AND user_id = ${userId}`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.send(result);
  })
}

module.exports = {
  handleFetchSightWords,
  handleInsertSightWord,
  handleUpdateSightWord
}