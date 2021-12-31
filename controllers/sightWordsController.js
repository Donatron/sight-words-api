const SightWord = require('../models/sightWordModel');

exports.getAllSightWords = async (req, res) => {
  try {
    const sightWords = await SightWord.find();

    res.status(200).json({
      status: 'success',
      results: sightWords.length,
      data: {
        sightWords
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Something went wrong...'
    });
  }
}

exports.createSightWord = async (req, res) => {
  try {
    const sightWord = await SightWord.create({
      word: req.body.word,
      syllables: req.body.syllables
    });

    res.status(200).json({
      status: 'success',
      data: {
        sightWord
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Something went wrong...'
    });
  }
}

exports.updateSightWord = async (req, res) => {
  try {
    const updatedSightWord = await SightWord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedSightWord) {
      return res.status(404).json({
        status: 'fail',
        message: 'No sight word found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        sightWord: updatedSightWord
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Something went wrong...'
    });
  }
}

exports.deleteSightWord = async (req, res) => {
  try {
    const sightWord = await SightWord.findByIdAndDelete(req.params.id);

    if (!sightWord) {
      return res.status(404).json({
        status: 'fail',
        message: 'Unable to find a sight word with that ID'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Something went wrong...'
    })
  }
}