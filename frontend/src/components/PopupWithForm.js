function PopupWithForm({ name, title, buttonText, children, isOpen, onClose, onSubmit }) {
    return (
        <div className="popupWithForm">
            <div className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`} >
                <div className="popup__container">
                    <h2 className="popup__title">{title}</h2>
                    <form onSubmit={onSubmit} action="#" method="post" className="popup__form" autoComplete="on">
                        {children}
                        <button className="popup__confirm" type="submit">{buttonText}</button>
                    </form>
                    <button type="button" className="popup__close popupEdit__close" onClick={onClose}></button>
                </div>
            </div>
        </div>
    )
}

export default PopupWithForm;