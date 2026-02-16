import { Navigate, Outlet } from 'react-router-dom'
import type { JSX } from 'react'

type Props = {
    children?: JSX.Element
}

const AdminProtectedRoute = ({ children }: Props) => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'admin') {
        return <Navigate to="/admin" replace />
    }

    return children ? children : <Outlet />
}

export default AdminProtectedRoute
