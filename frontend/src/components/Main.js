import React from "react";
import { Card } from "./Card";
import { CurrentUserContext } from "../context/CurrentUserContext";



function Main({
    loggedIn,
    cards,
    onEditProfile,
    onAddPlace,
    onEditAvatar,
    onCardClick,
    onCardLike,
    onCardDelete }) {

    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main>
            <section className="profile">
                <div className="profile__about">
                    <div className="profile__avatarbox">
                        <img src={currentUser.avatar} alt="Аватар" className="profile__avatar" />
                        <button type="button" className="profile__cover" onClick={onEditAvatar} ></button>
                    </div>
                    <div className="profile__info">
                        <div className="profile__namebox">
                            <h1 className="profile__name">{currentUser.name}</h1>
                            <button type="button" className="profile__edit-button" onClick={onEditProfile}>
                            </button>
                        </div>
                        <p className="profile__description">{currentUser.about}</p>
                    </div>
                </div>
                <button type="button" className="profile__add" onClick={onAddPlace}></button>
            </section>
            <section className="elements">
                {cards.map((card) => {
                    return (
                        <Card
                            card={card}
                            key={card._id}
                            name={card.name}
                            link={card.link}
                            likes={card.likes.length}
                            onCardClick={onCardClick}
                            onCardLike={onCardLike}
                            onCardDelete={onCardDelete}
                        />
                    )
                })}
            </section>
        </main>
    )
}

export default Main;