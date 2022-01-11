const catchAsync = require('../utils/catchAsync');
const SightWord = require('../models/sightWordModel');
const AppError = require('../utils/appError');

exports.getAllSightWords = catchAsync(async (req, res) => {
  const sightWords = await SightWord.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: sightWords.length,
    data: {
      sightWords
    }
  });
});

exports.createSightWord = catchAsync(async (req, res) => {
  const sightWord = await SightWord.create({
    word: req.body.word,
    syllables: req.body.syllables,
    user: req.user.id
  });

  res.status(200).json({
    status: 'success',
    data: {
      sightWord
    }
  });
});

exports.updateSightWord = catchAsync(async (req, res, next) => {
  const sightWord = await SightWord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!sightWord) return next(new AppError('Unable to locate a sight word with that ID', 404));

  res.status(200).json({
    status: 'success',
    sightWord
  });
});

exports.deleteSightWord = catchAsync(async (req, res, next) => {
  const sightWord = await SightWord.findByIdAndDelete(req.params.id);

  if (!sightWord) return next(new AppError('Unable to find a sight word with that ID', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});