import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('auth_is_admin') === 'true' : false

  if (!token) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
