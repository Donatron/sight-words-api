const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Phrase = require('../models/phraseModel');

exports.getAllPhrases = catchAsync(async (req, res, next) => {
  const phrases = await Phrase.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: phrases.length,
    data: {
      phrases
    }
  });
});

exports.createPhrase = catchAsync(async (req, res, next) => {
  const phrase = await Phrase.create({
    phrase: req.body.phrase,
    user: req.user.id
  });

  res.status(200).json({
    status: 'sucess',
    data: {
      phrase
    }
  });
});

exports.updatePhrase = catchAsync(async (req, res, next) => {
  const updatedPhrase = await Phrase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!updatedPhrase) return next(new AppError('Unable to find a phrase with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      phrase: updatedPhrase
    }
  });
});

exports.deletePhrase = catchAsync(async (req, res, next) => {
  const deletedPhrase = await Phrase.findByIdAndDelete(req.params.id);

  if (!deletedPhrase) return next(new AppError('Unable to locate a phrase with that ID', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});