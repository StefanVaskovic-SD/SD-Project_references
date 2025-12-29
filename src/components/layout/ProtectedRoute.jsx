import { useAuth } from '../../hooks/useAuth'
import { PasswordGate } from '../auth/PasswordGate'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isChecking } = useAuth()

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <PasswordGate />
  }

  return <>{children}</>
}

