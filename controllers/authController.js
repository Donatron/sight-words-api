const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const { sendEmail } = require('../utils/email');

const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + (process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
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

  const token = signToken(newUser._id);
  const confirmUrl = `${req.protocol}://${req.get('host')}/users/emailConfirm/${token}`;

  const mailOptions = {
    email,
    subject: 'Sight Words - Please Confirm Your Email',
    message: `Thank you for registering for Sight Words.\nPlease click the link below to confirm your email.\nIf you did not register, please disregard this email.\n\n${confirmUrl}`
  }

  await sendEmail(mailOptions);

  res.status(200).json({
    status: 'success',
    message: 'A confirmation email has been sent to your registered email address. Please click on the link and confirm your email to begin using Sight Words'
  });
});

exports.confirmEmail = catchAsync(async (req, res, next) => {
  const decoded = await promisify(jwt.verify)(req.params.token, process.env.JWT_SECRET, () => { });

  const user = await User.findByIdAndUpdate(decoded.id, { emailConfirmed: true }, { new: true, runValidators: true });

  createSendToken(user, 200, res);
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

  if (!user.emailConfirmed) return next(new AppError('You must confirm your email address before logging in. Please check your email', 401));

  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    $or: [
      {
        userName: req.body.userName
      },
      {
        email: req.body.userName
      }
    ]
  });

  if (!user) return next(new AppError('There is no user with that username/email', 404));

  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;

  const message = `Forgot your passsword? Enter a new password and password confirmation at this URL \n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Sight Words - Your Password Reset Token (valid for 10 minutes)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Your password reset token has been sent to your email.'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Please try again later', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = await crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: { $eq: hashedToken },
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) return next(new AppError('Password reset token is either invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(currentPassword, user.password))) return next(new AppError('You current password is wrong. Please enter the correct password', 401));

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
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