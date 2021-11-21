const handleFetchSightWords = (req, res, conn) => {
  const queryString = `SELECT * FROM words 
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

const handleInsertSightWord = (req, res, conn) => {
  const { word, syllables } = req.body;
  const queryString = `INSERT INTO words 
    (user_id, value, syllables) 
    VALUES("${req.user.id}","${word}","${syllables}")`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.json({
      status: 'success',
      result
    });
  });
}

const handleUpdateSightWord = (req, res, conn) => {
  const { id, word, syllables, complete } = req.body;
  const queryString = `UPDATE words SET 
    value="${word}", 
    syllables="${syllables}", 
    complete="${complete}" 
    WHERE id ="${id}" 
    AND user_id = ${req.user.id}`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.json({
      status: 'success',
      result
    });
  })
}

module.exports = {
  handleFetchSightWords,
  handleInsertSightWord,
  handleUpdateSightWord
}