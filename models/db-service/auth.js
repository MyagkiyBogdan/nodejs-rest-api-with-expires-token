const Users = require('../authSchema');
const bcrypt = require('bcrypt');

const getUserById = async contactId => {
  try {
    return Users.findOne({ _id: contactId });
  } catch (err) {
    throw new Error(err.message);
  }
};

const registerUser = async ({ email, password, subscription = 'starter' }) => {
  // в mongoose встроенная валидация, так что про уникальность можно не беспокоиться, а обработка ошибки происходит в models/db-service/auth - signupController
  try {
    // 10 - salt - количество рангов хеширования, не забыть await перед bcrypt.hash
    return Users.create({ email, password: await bcrypt.hash(password, 10), subscription });
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginUser = async ({ email }) => {
  try {
    return Users.findOne({ email });
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getUserById,
  registerUser,
  loginUser,
};
