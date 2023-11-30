const jwt = require('jsonwebtoken');
const STATUS_CODES = require('../constants/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const checkAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(STATUS_CODES.UNAUTHORIZED).send({
        message: 'Вы не авторизованы'
      })
    }
    const token = authorization.split(' ')[1];
    const result = await jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'VERY_SECRET_KEY');
    if (result) {
      req.user = {
        _id: result._id
      }
      next();
    }
  }
  catch (err) {
    if (err instanceof JsonWebTokenError) {
      return res.status(STATUS_CODES.UNAUTHORIZED).send({
        message: 'Ошибка авторизации'
      })
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка сервера'
    });
  }
}

module.exports = {
  checkAuth
};