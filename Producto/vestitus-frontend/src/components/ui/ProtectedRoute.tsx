import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin h-8 w-8 border-4 border-[var(--gold)] border-t-transparent rounded-full" /></div>
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  return <>{children}</>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isEmployee, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin h-8 w-8 border-4 border-[var(--gold)] border-t-transparent rounded-full" /></div>
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  if (!isEmployee) return <Navigate to="/" replace />
  return <>{children}</>
}
