import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

export default function RequireActive({ children }: { children: ReactNode }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const isActive = typeof window !== 'undefined' ? localStorage.getItem('auth_is_active') !== 'false' : true
  if (!token) return <Navigate to="/login" replace />
  if (!isActive) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
