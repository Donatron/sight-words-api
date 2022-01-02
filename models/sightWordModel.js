const mongoose = require('mongoose');

const sightWordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: [true, 'A sight word must not be empty'],
    minLength: [2, 'A word must be at least 2 characters long.'],
    maxLength: [25, 'That word seems a little long. Try something under 25 characters.']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'You must be a logged in user to add a sight word']
  },
  syllables: String,
  complete: {
    type: Boolean,
    default: false
  }
});

sightWordSchema.index({ user: 1 });

sightWordSchema.pre('find', function (next) {
  this.populate({
    path: 'user',
    select: 'userName'
  });

  next();
});

const SightWord = mongoose.model('SightWord', sightWordSchema);

module.exports = SightWord;