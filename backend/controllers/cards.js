const mongoose = require('mongoose');
const Card = require('../models/card');
const STATUS_CODES = require('../constants/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'На сервере произошла ошибка',
    }));
};

const postCard = async (req, res) => {
  try {
    const newCard = new Card(req.body);
    newCard.owner = req.user._id;
    res.status(STATUS_CODES.OK).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(STATUS_CODES.BAD_REQUEST).send({
        message: 'Некорректные данные',
      });
    } else {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    }
  }
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.isValidObjectId(cardId)) {
    res.status(STATUS_CODES.BAD_REQUEST).send({
      message: 'Невозможно удалить карточку: невалидный _id',
    });
  } else {
    Card.findById(cardId)
      .then((card) => {
        if (!card) {
          res.status(STATUS_CODES.NOT_FOUND).send({
            message: 'Карточка не найдена!',
          });
        } else if (card.owner.toString() !== req.user._id) {
          res.status(STATUS_CODES.FORBIDDEN).send({
            message: 'Невозможно удалить карточку: это не ваша карточка',
          });
        } else {
          Card.deleteOne({ _id: cardId })
            .then(() => {
              res.status(STATUS_CODES.OK).send({
                message: 'Карточка удалена',
              });
            });
        }
      })
      .catch(() => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      }));
  }
};

const likeCard = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.cardId)) {
    res.status(STATUS_CODES.BAD_REQUEST).send({
      message: 'Некорректные данные',
    });
  } else {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .then((card) => {
        if (!card) {
          res.status(STATUS_CODES.NOT_FOUND).send({
            message: 'Карточка с указанным _id не найдена.',
          });
        } else {
          res.send(card);
        }
      })
      .catch(() => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      }));
  }
};

const dislikeCard = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.cardId)) {
    res.status(STATUS_CODES.BAD_REQUEST).send({
      message: 'Некорректные данные',
    });
  } else {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .then((card) => {
        if (!card) {
          res.status(STATUS_CODES.NOT_FOUND).send({
            message: 'Карточка с указанным _id не найдена.',
          });
        } else {
          res.send(card);
        }
      })
      .catch(() => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      }));
  }
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
