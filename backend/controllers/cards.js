const mongoose = require('mongoose');
const Card = require('../models/card');
const STATUS_CODES = require('../constants/errors');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const postCard = async (req, res, next) => {
  try {
    const newCard = new Card(req.body);
    newCard.owner = req.user._id;
    res.status(STATUS_CODES.OK).send(await newCard.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
    } else {
      next(err);
    }
  }
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.isValidObjectId(cardId)) {
    next(new BadRequestError('Невозможно удалить карточку: невалидный _id'));
  } else {
    Card.findById(cardId)
      .then((card) => {
        if (!card) {
          next(new NotFoundError('Карточка не найдена'));
        } else if (card.owner.toString() !== req.user._id) {
          next(new ForbiddenError('Невозможно удалить карточку: это не ваша карточка'));
        } else {
          Card.deleteOne({ _id: cardId })
            .then(() => {
              res.status(STATUS_CODES.OK).send({
                message: 'Карточка удалена',
              });
            });
        }
      })
      .catch(next);
  }
};

const likeCard = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.cardId)) {
    next(new BadRequestError('Некорректные данные'));
  } else {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          next(new NotFoundError('Карточка с указанным _id не найдена'));
        } else {
          res.send(card);
        }
      })
      .catch(next);
  }
};

const dislikeCard = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.cardId)) {
    next(new BadRequestError('Некорректные данные'));
  } else {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          next(new NotFoundError('Карточка с указанным _id не найдена'));
        } else {
          res.send(card);
        }
      })
      .catch(next);
  }
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
