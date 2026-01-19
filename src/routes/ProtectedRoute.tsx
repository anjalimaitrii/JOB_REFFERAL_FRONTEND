import type { JSX } from 'react'
import { Navigate } from 'react-router-dom'

type Role = 'student' | 'employee'

type Props = {
  children: JSX.Element
  allowedRole: Role | Role[]   
}

const ProtectedRoute = ({ children, allowedRole }: Props) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role') as Role | null

  if (!token) return <Navigate to="/" />

  const allowedRoles = Array.isArray(allowedRole)
    ? allowedRole
    : [allowedRole]

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
