import { Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

function Header({ headerEmail, loggedIn, signOut }) {

    return (
        <header className="header">
            <div className="header__logo"></div>
            <div className="header__user">
                {!loggedIn && <Routes>
                    <Route path={'sign-up'} element={<Link to={'/sign-in'} className={'header__authorize-action'}>Войти</Link>} />
                    <Route path={'sign-in'} element={<Link to={'/sign-up'} className={'header__authorize-action'}>Регистрация</Link>} />
                </Routes>}
                {loggedIn && <>
                    <div className={'header__email'}>{headerEmail}</div>
                    <button onClick={signOut} className={'header__authorize-action header__authorize-action_logout'}>Выйти</button>
                </>}
            </div>
        </header>
    )
}

export default Header;