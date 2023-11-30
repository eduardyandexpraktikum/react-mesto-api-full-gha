import { Navigate } from 'react-router'

export function ProtectedRoute({ element: Component, ...props }) {

    return (
        props.loggedIn ? <Component {...props} /> : <Navigate to={'./sign-in'} replace />
    )
}