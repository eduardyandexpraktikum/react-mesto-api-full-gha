function ImagePopup({ card, onClose }) {
    return (
        <div className={`popup  popupImage ${card.link ? 'popup_opened' : ''}`}>
            <div className="popupImage__container">
                <img src={card.link} alt={card.name} className="popupImage__pic" />
                <p className="popupImage__description">{card.name}</p>
                <button type="button" className="popup__close popupImage__close" onClick={onClose}></button>
            </div>
        </div>
    )
}

export default ImagePopup;