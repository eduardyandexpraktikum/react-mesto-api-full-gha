import React, { useState } from "react";
import PopupWithForm from "./PopupWithForm";

export function AddPlacePopup({ isOpen, onClose, onAddPlace }) {

    const [name, setName] = useState("");
    const [link, setLink] = useState("");

    function handlePlaceName(e) {
        setName(e.target.value);
    }

    function handlePlaceLink(e) {
        setLink(e.target.value);
        console.log(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace({
            name,
            link,
        });
    }

    return (
        <PopupWithForm
            name="add"
            title="Новое место"
            buttonText="Создать"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}>

            <div className="popup__inputSection">
                <input onChange={handlePlaceName} value={name} type="text" id="addImageName" className="popup__inputs popup__inputs_field_name"
                    placeholder="Название" name="name" minLength="2" maxLength="30" required />
                <span className="popup__input-error"></span>
            </div>
            <div className="popup__inputSection">
                <input onChange={handlePlaceLink} value={link} type="url" id="addImageLink" className="popup__inputs popup__inputs_field_link"
                    placeholder="Ссылка на картинку" name="link" required />
                <span className="popup__input-error"></span>
            </div>
        </PopupWithForm>
    )
}