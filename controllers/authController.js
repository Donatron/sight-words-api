const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
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

exports.signup = catchAsync(async (req, res, next) => {
  const { name, userName, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    name,
    userName,
    email,
    password,
    passwordConfirm
  });

  const token = await signToken(newUser._id);

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password) return next(new AppError('Please enter an email/username and password', 400));

  const user = await User.findOne({
    $or: [
      { email: userName },
      { userName }
    ]
  }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) return next(new AppError('Incorrect email/username or password', 401));

  const token = await signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization) token = req.headers.authorization.split(' ')[1];

  if (!token) return next(new AppError('You must be logged in to get access', 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET, () => { });

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) return next(new AppError('The user belonging to this token no longer exists', 401));
  if (currentUser.passwordChangedAfter(decoded.iat)) next(new AppError('Recently changed password. Please log in again', 401));

  req.user = currentUser;

  next();
})