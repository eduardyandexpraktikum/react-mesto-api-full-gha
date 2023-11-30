export function InfoTooltip({ isOpen, onClose, successReg }) {

    return (
        <div className={`popup ${isOpen && 'popup_opened'}`}>
            <div className="popup__container">
                <div className={successReg ? "popup__tooltip_pic_success" : "popup__tooltip_pic_fail"} />
                <p className="popup__tooltip_description">{successReg ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}</p>
                <button className="popup__close" onClick={onClose} />
            </div>
        </div>
    )
}