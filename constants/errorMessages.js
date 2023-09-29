const serverErrorMsg = 'На сервере произошла ошибка';

const incorrectMovieInputMsg = 'Переданы некорректные данные при создании фильма.';
const movieNotFoundMsg = 'Фильм с указанным _id не найден.';
const cannotDeleteMovieMsg = 'Нельзя удалить чужой фильм.';
const incorrectDeleteMovieInputMsg = 'Переданы некорректные данные для удаления фильм.';

const emailOrPasswordEmptyMsg = 'Email или пароль не могут быть пустыми';
const userAlreadyExistsMsg = 'Пользователь с таким email уже существует.';
const incorrectUserInputMsg = 'Переданы некорректные данные при создании пользователя.';
const incorrectUserUpdateMsg = 'Переданы некорректные данные при обновлении пользователя.';

const incorrectEmailOrPasswordMsg = 'Неверные e-mail или пароль.';
const authRequiredMsg = 'Необходима авторизация';

const pageNotFoundMsg = 'Страница не существует.';

module.exports = {
  serverErrorMsg,
  incorrectMovieInputMsg,
  movieNotFoundMsg,
  cannotDeleteMovieMsg,
  incorrectDeleteMovieInputMsg,
  emailOrPasswordEmptyMsg,
  userAlreadyExistsMsg,
  incorrectUserInputMsg,
  incorrectUserUpdateMsg,
  incorrectEmailOrPasswordMsg,
  authRequiredMsg,
  pageNotFoundMsg,
};
