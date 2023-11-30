const { Joi, celebrate } = require('celebrate');

const regularEx = /^(http|https):\/\/(?:www\.)?[a-zA-Z0-9._~\-:?#[\]@!$&'()*+,/;=]{2,256}\.[a-zA-Z0-9./?#-]{2,}$/;

const signInValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signUpValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regularEx),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const profileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});

const userIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

const AvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regularEx),
  }),
});

const postCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regularEx),
  }),
});

module.exports = {
  signInValidator,
  signUpValidator,
  profileValidator,
  cardIdValidator,
  userIdValidator,
  AvatarValidator,
  postCardValidator
};