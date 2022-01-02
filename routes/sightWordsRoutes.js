const express = require('express');
const authController = require('../controllers/authController');
const sightWordsController = require('../controllers/sightWordsController');

const router = express.Router();

router.route('/')
  .get(
    authController.protect,
    sightWordsController.getAllSightWords
  )
  .post(
    authController.protect,
    sightWordsController.createSightWord
  );

router.route('/:id')
  .patch(
    authController.protect,
    sightWordsController.updateSightWord
  )
  .delete(
    authController.protect,
    sightWordsController.deleteSightWord
  );

module.exports = router;