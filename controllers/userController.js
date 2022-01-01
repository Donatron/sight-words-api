const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
}

exports.updateMe = async (req, res) => {
  const filteredObj = filterObj(req.body, 'name', 'userName');
  const token = req.headers.authorization.split(' ')[1];
  const decoded = await jwt.decode(token, process.env.JWT_SECRET);

  try {
    const updatedUser = await User.findByIdAndUpdate(decoded.id, filteredObj, { new: true, runValidators: true });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}

exports.deleteMe = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = await jwt.decode(token, process.env.JWT_SECRET);

  await User.findByIdAndUpdate(decoded.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
}