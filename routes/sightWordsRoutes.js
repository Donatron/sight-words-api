const express = require('express');
const sightWordsController = require('../controllers/sightWordsController');

const router = express.Router();

router.route('/')
  .get(sightWordsController.getAllSightWords)
  .post(sightWordsController.createSightWord)
  .patch(sightWordsController.updateSightWord)
  .delete(sightWordsController.deleteSightWord);

module.exports = router;