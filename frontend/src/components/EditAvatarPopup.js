import React from "react"
import PopupWithForm from "./PopupWithForm"

export function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {

    const avatarChange = React.useRef();


    function handleSubmit(e) {
        e.preventDefault();
        console.log(avatarChange.current.value);
        onUpdateAvatar({
            link: avatarChange.current.value
        });
    }

    return (
        <PopupWithForm name="avatar"
            title="Обновить аватар"
            buttonText="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}>

            <div className="popup__inputSection">
                <input ref={avatarChange} type="url" id="avatarImageLink" className="popup__inputs popup__inputs_field_link"
                    placeholder="Ссылка на картинку" required />
                <span className="popup__input-error"></span>
            </div>
        </PopupWithForm>
    )
}