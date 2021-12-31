const express = require('express');
const phrasesController = require('../controllers/phrasesController');

const router = express.Router();

router.route('/')
  .get(phrasesController.getAllPhrases)
  .post(phrasesController.createPhrase);

router.route('/:id')
  .patch(phrasesController.updatePhrase)
  .delete(phrasesController.deletePhrase);

module.exports = router;