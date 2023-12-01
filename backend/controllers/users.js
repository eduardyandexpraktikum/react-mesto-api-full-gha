const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const STATUS_CODES = require('../constants/errors');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash
    })
    return res.status(201).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    })
  } catch (err) {
    if (err.code === 11000) {
      res.status(STATUS_CODES.CONFLICT).send({
        message: 'Такой email уже существует',
      });
      next(new ConflictError('Такой email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new BadRequestError('Неподходящий логин и/или пароль'));
    }
    const loginUser = await User.findOne({ email }).select('+password');
    if (!loginUser) {
      return next(new UnauthorizedError('Некорректный логин и/или пароль'));
    }
    const result = bcrypt.compare(password, loginUser.password)
      .then((matched) => {
        if (!matched) {
          return false;
        }
        return true;
      });
    if (!result) {
      return next(new ForbiddenError('Некорректный логин и/или пароль'));
    }

    const payload = { _id: loginUser._id }

    const token = jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'VERY_SECRET_KEY', { expiresIn: '7d' })
    res.status(STATUS_CODES.OK).send({ token, email })
  } catch (err) {
    next(err);
  }
}

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    return next(new BadRequestError('Некорректный id'));
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const getMe = (req, res, next) => {
  const myself = req.user._id;
  User.findById(myself)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Нет информации'));
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const patchMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name;
    user.about = req.body.about;
    return res.status(STATUS_CODES.OK).send(await user.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные'));
    }
    next(err);
  }
};

const patchAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.avatar = req.body.avatar;
    return res.status(STATUS_CODES.OK).send(await user.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные'));
    }
    next(err);
  }
};

module.exports = {
  login,
  getUserById,
  getMe,
  getUsers,
  createUser,
  patchMe,
  patchAvatar,
};
