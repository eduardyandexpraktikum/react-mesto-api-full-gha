import { useState } from "react";


export function Login({ onSubmit }) {

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
        <div className="login">
            <h2 className="login__title">Вход</h2>
            <form className="login__form" onSubmit={handleSubmit}>
                <input className="login__inputs login__inputs_field_email" value={formValue.email} placeholder="Email" name="email" onChange={handleChange} type="email"></input>
                <input className="login__inputs login__inputs_field_password" value={formValue.password} placeholder="Пароль" name="password" onChange={handleChange} type="password"></input>
                <button className="login__button">Войти</button>
            </form>
        </div>
    )

};