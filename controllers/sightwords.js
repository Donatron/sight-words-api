const handleFetchSightWords = (req, res, conn) => {
  const queryString = `SELECT * FROM words 
    WHERE user_id = ${req.user.id}`;

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
  const { word, syllables, complete } = req.body;
  const { wordId } = req.params

  let queryString = 'UPDATE words SET ';

  if (req.body.word) queryString += `value = "${word}"`;
  if (req.body.word && req.body.syllables) queryString += ', ';
  if (req.body.syllables) queryString += `syllables = "${syllables}"`;
  if (req.body.word || req.body.syllables && req.body.complete) queryString += ', ';
  if (req.body.complete) queryString += `complete = "${complete}"`;

  queryString += ` WHERE id = ${wordId} AND user_id = ${req.user.id}`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    res.json({
      status: 'success',
      result
    });
  })
}

const handleDeleteSightWord = (req, res, conn) => {
  const { wordId } = req.params;
  const queryString = `DELETE FROM words WHERE
    id = ${wordId} AND user_id = ${req.user.id}`;

  conn.query(queryString, (err, result, fields) => {
    if (err) throw err;

    if (result.affectedRows === 0) {
      res.json({
        status: 'error',
        message: 'Unable to delete word.'
      })
    } else {
      res.json({
        status: 'success'
      });
    }
  });
}

module.exports = {
  handleFetchSightWords,
  handleInsertSightWord,
  handleUpdateSightWord,
  handleDeleteSightWord
}