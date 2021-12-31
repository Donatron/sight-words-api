const express = require('express');
const sightWordsController = require('../controllers/sightWordsController');

const router = express.Router();

router.route('/')
  .get(sightWordsController.getAllSightWords)
  .post(sightWordsController.createSightWord)

router.route('/:id')
  .patch(sightWordsController.updateSightWord)
  .delete(sightWordsController.deleteSightWord);;

module.exports = router;