import React, { useState } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../context/CurrentUserContext";

export function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const currentUser = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, isOpen]);

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            name="edit"
            title="Редактировать профиль"
            buttonText="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit} >

            <div className="popup__inputSection">
                <input type="text" value={name || ''} onChange={handleNameChange} id="name_change" className="popup__inputs popup__inputs_field_name" placeholder="Имя"
                    name="name" minLength="2" maxLength="40" required />
                <span className="popup__input-error"></span>
            </div>
            <div className="popup__inputSection">
                <input type="text" value={description || ''} onChange={handleDescriptionChange} id="description_change" className="popup__inputs popup__inputs_field_description"
                    placeholder="О себе" name="about" minLength="2" maxLength="200" required />
                <span className="popup__input-error"></span>
            </div>
        </PopupWithForm>
    )
}