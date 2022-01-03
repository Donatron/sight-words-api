const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.patch('/emailConfirm/:token', authController.confirmEmail);
router.post('/login', authController.login);

router.route('/updateMe')
  .patch(
    authController.protect,
    userController.updateMe
  );

router.route('/deleteMe')
  .delete(
    authController.protect,
    userController.deleteMe
  );

module.exports = router;