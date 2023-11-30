import React from 'react';
import bin from '../images/bin.svg';
import { CurrentUserContext } from '../context/CurrentUserContext';


export function Card({ card, name, link, likes, onCardClick, onCardLike, onCardDelete }) {

    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = card.owner._id === currentUser._id;
    const isLiked = card.likes.some(item => item._id === currentUser._id);
    const cardLikeButtonClassName = (
        `element__like ${isLiked && 'element__like_active'}`
    );;

    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card);
    }

    function handleDeleteClick() {
        onCardDelete(card)
    }

    return (
        <article className="element">
            <img className="element__image" src={link} alt={name} onClick={handleClick} />
            {isOwn &&
                <button className="element__bin" type="button" onClick={handleDeleteClick}>
                    <img src={bin} id="bin" alt="Удалить" />
                </button>
            }
            <div className="element__caption">
                <h2 className="element__description">{name}</h2>
                <div className="element__likebox">
                    <button className={cardLikeButtonClassName} type="button" onClick={handleLikeClick}>
                    </button>
                    <p className="element__likecounter">{likes}</p>
                </div>
            </div>
        </article>
    )
}
