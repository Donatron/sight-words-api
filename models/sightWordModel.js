const mongoose = require('mongoose');

const sightWordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: [true, 'A sight word must not be empty'],
    minLength: [2, 'A word must be at least 2 characters long.'],
    maxLength: [25, 'That word seems a little long. Try something under 25 characters.']
  },
  syllables: String,
  complete: {
    type: Boolean,
    default: false
  }
});

const SightWord = mongoose.model('SightWord', sightWordSchema);

module.exports = SightWord;