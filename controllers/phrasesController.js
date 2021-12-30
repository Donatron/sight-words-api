exports.getAllPhrases = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      phrases: "All phrases..."
    }
  })
}

exports.createPhrase = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      phrases: "Creating phrase..."
    }
  })
}

exports.updatePhrase = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      phrases: "Updating phrase..."
    }
  })
}

exports.deletePhrase = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      phrases: "Deleting phrase..."
    }
  })
}