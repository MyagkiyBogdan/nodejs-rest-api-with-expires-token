const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserById, registerUser, loginUser } = require('../models/db-service/auth');

const schema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .min(5)
    .max(35),
  password: Joi.string().min(6).max(25).required(),
});

const signupController = async (req, res, next) => {
  try {
    const validationBody = schema.validate(req.body);
    if (validationBody.error) {
      return res.status(400).json({ message: validationBody.error.message });
    }

    const newUser = await registerUser(req.body);
    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    if (error.message.includes('duplicate key error')) {
      return res.status(400).json({ message: 'Email in use' });
    }
    return res.status(400).json({ message: error.message });
  }
};

const loginController = async (req, res, next) => {
  try {
    const validationBody = schema.validate(req.body);
    if (validationBody.error) {
      return res.status(400).json({ message: validationBody.error.message });
    }

    const user = await loginUser(req.body);

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new Error('Email or password is wrong');
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' });

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const logoutController = async (req, res, next) => {
  const user = await getUserById(req.params.contactId);
  res.json(user);
};

const currentController = async (req, res, next) => {};

module.exports = {
  loginController,
  signupController,
  logoutController,
  currentController,
};
