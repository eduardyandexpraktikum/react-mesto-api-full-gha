import React from 'react';
import '../index.css'
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup';
import { useState, useEffect } from 'react';
import { api } from '../utils/Api';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import { Route, Routes, useNavigate } from 'react-router'
import { Login } from './Login';
import { Register } from './Register';
import { ProtectedRoute } from './ProtectedRoute';
import { InfoTooltip } from './InfoTooltip';
import { checkToken, register, login } from '../utils/Auth';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isTooltipPopupOpen, setIsTooltipPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [successReg, setSuccessReg] = useState(false);
  const [headerEmail, setHeaderEmail] = useState('');

  const navigate = useNavigate();

  // const tokenCheck = () => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     checkToken(token)
  //       .then((user) => {
  //         handleLogin(user);
  //         setLoggedIn(true);
  //         navigate('/');
  //       })
  //       .catch(console.log)
  //   }
  // }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsTooltipPopupOpen(false);
    setSelectedCard({});
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleAddPlaceSubmit(data) {
    api.postNewCard(data.name, data.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => { console.log(err) });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((thisCard) => thisCard._id !== card._id)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.putLike(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => { console.log(err) });
  }

  function handleUpdateUser(data) {
    api.patchUserInfo(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => { console.log(err) });
  }

  function handleUpdateAvatar(data) {
    api.patchAvatar(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => { console.log(err) });
  }

  function handleLogin(user) {
    setLoggedIn(true);
    setHeaderEmail(user.email);
  }

  function handleRegister(values) {
    register(values)
      .then((data) => {
        console.log(data)
        if (data) {
          setSuccessReg(true);
          setIsTooltipPopupOpen(true)
        };
      })
      .catch(() => {
        setSuccessReg(false);
        setIsTooltipPopupOpen(true);
      })
      .finally(() => {
        if (setSuccessReg) {
          navigate('/sign-in');
        }
      })
  }

  function handleAuth(values) {
    login(values)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          handleLogin(data);
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function signOut() {
    localStorage.removeItem('token')
    navigate('./sign-in')
    setLoggedIn(false)
  }

  useEffect(() => {
    console.log('textAuth');
    const tokenCheck = () => {
      const token = localStorage.getItem('token');
      if (token) {
        checkToken(token)
          .then((user) => {
            handleLogin(user);
            setLoggedIn(true);
            navigate('/');
          })
          .catch(console.log)
      }
    }
    tokenCheck();
  }, [loggedIn]);

  useEffect(() => {
    console.log('textUser')
    api.getUserInfo()
      .then((data) => {
        console.log(data);
        setCurrentUser(data);
      })
      .catch((err) => { console.log(err) });
  }, []);

  useEffect(() => {
    console.log('textCard')
    api.getInitialCards()
      .then((data) => {
        setCards(data)
      })
      .catch((err) => { console.log(err) });
  }, [setCards]);

  return (
    <div className='body'>
      <div className="body__mainframe">
        <CurrentUserContext.Provider value={currentUser}>
          <Header
            headerEmail={headerEmail}
            loggedIn={loggedIn}
            signOut={signOut}
          />
          <Routes>
            <Route
              path={'/'}
              element={<>
                <ProtectedRoute
                  element={Main}
                  loggedIn={loggedIn}
                  cards={cards}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
                <Footer />
              </>
              }
            />
            <Route
              path={'/signin'}
              element={
                <Login
                  onSubmit={handleAuth}
                />
              }
            />
            <Route
              path={'/signup'}
              element={
                <Register
                  onSubmit={handleRegister} />
              }
            />
          </Routes>
          <InfoTooltip
            isOpen={isTooltipPopupOpen}
            onClose={closeAllPopups}
            successReg={successReg}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser} />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit} />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}>
          </ImagePopup>
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
