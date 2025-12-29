import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const AUTH_STORAGE_KEY = 'studio_direction_auth'
const AUTH_PASSWORD = 'direkcija2025'

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on mount
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedAuth === AUTH_PASSWORD) {
      setIsAuthenticated(true)
    }
    setIsChecking(false)
  }, [])

  const login = (password) => {
    if (password === AUTH_PASSWORD) {
      localStorage.setItem(AUTH_STORAGE_KEY, password)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isChecking, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

