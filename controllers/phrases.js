const handleFetchPhrases = (req, res, conn) => {
  const queryString = `SELECT * FROM phrases 
    WHERE user_id = ${req.user.id}`;

  conn.query(queryString, (err, result, fields) => {
    if (err) res.json({
      status: 'error',
      message: 'Unable to fetch phrases at the moment. Please try later'
    });

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
    if (err) res.json({
      status: 'error',
      message: 'Unable to add new phrase at the moment. Please try again later'
    })

    res.json({
      status: 'success',
      result
    });
  });
}

const handleUpdatePhrase = (req, res, conn) => {
  const { phrase, complete } = req.body;
  const { phraseId } = req.params;

  let queryString = 'UPDATE phrases SET ';

  if (req.body.phrase) queryString += `value = "${phrase}"`;
  if (req.body.phrase && req.body.complete) queryString += ', ';
  if (req.body.complete) queryString += `complete = "${complete}"`;

  queryString += ` WHERE id = ${phraseId} AND user_id = ${req.user.id}`;

  conn.query(queryString, (err, result, fields) => {
    if (err) res.json({
      status: 'error',
      message: 'Unable to update phrase at the moment. Please try again later'
    })

    res.json({
      status: 'success',
      result
    });
  });
}

const handleDeletePhrase = (req, res, conn) => {
  const { phraseId } = req.params;
  const queryString = `DELETE FROM phrases WHERE
    id = ${phraseId} AND user_id = ${req.user.id}`;

  conn.query(queryString, (err, result, fields) => {
    if (err) res.json({
      status: 'error',
      message: 'Unable to delete phrase at the moment. Please try again later'
    });

    if (result.affectedRows === 0) {
      res.json({
        status: 'error',
        message: 'Unable to delete phrase.'
      })
    } else {
      res.json({
        status: 'success'
      });
    }
  });
}

module.exports = {
  handleFetchPhrases,
  handleInsertPhrase,
  handleUpdatePhrase,
  handleDeletePhrase
}