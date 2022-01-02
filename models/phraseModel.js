const mongoose = require('mongoose');

const phraseSchema = new mongoose.Schema({
  phrase: {
    type: String,
    required: [true, 'A phrase cannot be empty.'],
    minLength: [4, 'That phrase is too short. A phrase must be at least 4 characters long.'],
    maxLength: [100, 'That\'s a pretty long phrase. You must have a good command of English. Are you sure you need to use this app?']
  },
  complete: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'You must be a logged in user to add a phrase']
  }
});

phraseSchema.index({ user: 1 });

phraseSchema.pre('find', function (next) {
  this.populate({
    path: 'user',
    select: 'userName'
  })
  next();
});

const Phrase = mongoose.model('Phrase', phraseSchema);

module.exports = Phrase;