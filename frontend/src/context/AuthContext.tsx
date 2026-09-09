import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as api from '../api'

interface AuthContextValue {
  user: api.UserResponse | null
  token: string | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<api.UserResponse | null>(null)
  const [token, setToken] = useState<string | null>(api.loadToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    api
      .getProfile(token)
      .then(setUser)
      .catch(() => {
        api.removeToken()
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const login = async (newToken: string) => {
    api.saveToken(newToken)
    setToken(newToken)
    const profile = await api.getProfile(newToken)
    setUser(profile)
  }

  const logout = () => {
    api.removeToken()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
