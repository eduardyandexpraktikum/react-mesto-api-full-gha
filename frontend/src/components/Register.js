import { useState } from "react";


export function Register({ onSubmit }) {

    const [formValue, setFormValue] = useState({
        email: '',
        password: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formValue)
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormValue({
            ...formValue,
            [name]: value
        });
    }

    return (
        <div className="register">
            <h2 className="register__title">Регистрация</h2>
            <form className="register__form" onSubmit={handleSubmit}>
                <input className="register__inputs register__inputs_field_email" value={formValue.email} placeholder="Email" name="email" type="email" onChange={handleChange}></input>
                <input className="register__inputs register__inputs_field_password" value={formValue.password} placeholder="Пароль" name="password" type="password" onChange={handleChange}></input>
                <button className="register__button">Зарегистрироваться</button>
                <p className="register__description">Уже зарегистрированы? Войти</p>
            </form>
        </div>

    )
}