const Phrase = require('../models/phraseModel');

exports.getAllPhrases = async (req, res) => {
  try {
    const phrases = await Phrase.find();

    if (!phrases) {
      res.status(404).json({
        status: 'fail',
        message: 'Something went wrong...'
      });
    }

    res.status(200).json({
      status: 'success',
      results: phrases.length,
      data: {
        phrases
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Something went wrong...'
    });
  }
}

exports.createPhrase = async (req, res) => {
  try {
    const phrase = await Phrase.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        phrase
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Something went wrong...'
    });
  }
}

exports.updatePhrase = async (req, res) => {
  try {
    const updatedPhrase = await Phrase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedPhrase) {
      return res.status(404).json({
        status: 'fail',
        message: 'Unable to find a phrase with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        phrase: updatedPhrase
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Something went wrong...'
    });
  }
}

exports.deletePhrase = async (req, res) => {
  try {
    const phrase = await Phrase.findByIdAndDelete(req.params.id);

    if (!phrase) {
      return res.status(404).json({
        status: 'fail',
        message: 'Unable to find a phrase with that ID'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Something went wrong'
    });
  }
}