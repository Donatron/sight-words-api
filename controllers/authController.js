const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = async (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
}

exports.signup = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, userName, password } = req.body;

    if (!(email || userName) || !password) {
      return res.status(400).json({
        status: 'fail',
        message: "Please provide email/username and your password"
      });
    }

    const user = await User.findOne({
      $or: [
        { email: { $eq: req.body.email } },
        { userName: { $eq: req.body.userName } }
      ]
    }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        status: 'fail',
        message: 'Incorrect email/username or password'
      });
    }

    const token = await signToken(user._id);

    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    res.status(200).json({
      status: 'fail',
      message: err
    });
  }
}