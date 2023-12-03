export const baseUrl = 'https://api.eduard.nomoredomainsmonster.ru'

export function register({ email, password }) {
    return fetch(`${baseUrl}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(_getResponseData)
}

export function login({ email, password }) {
    return fetch(`${baseUrl}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(_getResponseData)
        .then((data) => {
            localStorage.setItem('token', data.token)
            return data;
        })
}

export function checkToken() {
    const token = localStorage.getItem('token');
    return fetch(`${baseUrl}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(_getResponseData);
}

export function _getResponseData(res) {
    if (!res.ok) {
        return Promise.reject(`Ошибка ${res.status}`);
    }
    return res.json();
}