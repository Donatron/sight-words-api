exports.getAllSightWords = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      words: "All words..."
    }
  })
}

exports.createSightWord = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      words: "Creating word..."
    }
  })
}

exports.updateSightWord = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      words: "Updating word..."
    }
  })
}

exports.deleteSightWord = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: {
      words: "Deleting word..."
    }
  })
}