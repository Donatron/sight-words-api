const express = require('express');
const authController = require('../controllers/authController');
const phrasesController = require('../controllers/phrasesController');

const router = express.Router();

router.route('/')
  .get(
    authController.protect,
    phrasesController.getAllPhrases
  )
  .post(
    authController.protect,
    phrasesController.createPhrase
  );

router.route('/:id')
  .patch(
    authController.protect,
    phrasesController.updatePhrase
  )
  .delete(
    authController.protect,
    phrasesController.deletePhrase
  );

module.exports = router;