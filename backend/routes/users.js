const userRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  patchMe,
  patchAvatar,
  getMe,
} = require('../controllers/users');
const {
  userIdValidator,
  profileValidator,
  AvatarValidator
} = require('../middlewares/validator');

userRouter.get('/', getUsers);
userRouter.get('/me', getMe);
userRouter.get('/:userId', userIdValidator, getUserById);



userRouter.patch('/me', profileValidator, patchMe);
userRouter.patch('/me/avatar', AvatarValidator, patchAvatar);

module.exports = userRouter;
