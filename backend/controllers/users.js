const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const STATUS_CODES = require('../constants/errors');

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
    } else if (err.name === 'ValidationError') {
      res.status(STATUS_CODES.BAD_REQUEST).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    } else {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
      next(err);
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(STATUS_CODES.BAD_REQUEST).send({
        message: 'Неподходящий логин и/или пароль',
      })
    }
    const loginUser = await User.findOne({ email }).select('+password');
    if (!loginUser) {
      return res.status(STATUS_CODES.UNAUTHORIZED).send({
        message: 'Некорректный логин и/или пароль'
      })
    }
    const result = bcrypt.compare(password, loginUser.password)
      .then((matched) => {
        if (!matched) {
          return false;
        }
        return true;
      });
    if (!result) {
      res.status(STATUS_CODES.FORBIDDEN).send({
        message: 'Некорректный логин и/или пароль'
      })
    }

    const payload = { _id: loginUser._id }

    const token = jwt.sign(payload, 'VERY_SECRET_KEY', { expiresIn: '7d' })
    res.status(STATUS_CODES.OK).send({ token, email })
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'На сервере произошла ошибка',
    })
  }
}

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'На сервере произошла ошибка',
    }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    res.status(STATUS_CODES.BAD_REQUEST).send({
      message: 'Некорректный id',
    });
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(STATUS_CODES.NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      } else {
        res.send(user);
      }
    })
    .catch(() => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'На сервере произошла ошибка',
    }));
};

const getMe = (req, res) => {
  const myself = req.user._id;
  User.findById(myself)
    .then((user) => {
      if (!user) {
        res.status(STATUS_CODES.NOT_FOUND).send({
          message: 'Нет информации'
        });
      } else {
        res.send(user);
      }
    })
    .catch(() => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'На сервере произошла ошибка',
    }));
};

const patchMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name;
    user.about = req.body.about;
    return res.status(STATUS_CODES.OK).send(await user.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(STATUS_CODES.BAD_REQUEST).send({
        message: 'Некорректные данные',
      });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'На сервере произошла ошибка',
    });
  }
};

const patchAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.avatar = req.body.avatar;
    return res.status(STATUS_CODES.OK).send(await user.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(STATUS_CODES.BAD_REQUEST).send({
        message: 'Некорректные данные',
      });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'На сервере произошла ошибка',
    });
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
