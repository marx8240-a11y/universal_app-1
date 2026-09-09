import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as api from '../api'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState({ username: false, password: false })

  const usernameError =
    touched.username && username.length > 0 && username.length < 3
      ? 'Username must be at least 3 characters'
      : null

  const passwordError =
    touched.password && password.length > 0 && password.length < 6
      ? 'Password must be at least 6 characters'
      : null

  const isFormValid = username.length >= 3 && password.length >= 6

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await api.login(username, password)
      await login(data.access_token)
      navigate('/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1>Welcome Back</h1>
      <p className="subtitle">Log in to your account</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, username: true }))}
            className={usernameError ? 'invalid' : ''}
            aria-invalid={!!usernameError}
            aria-describedby={usernameError ? 'login-username-error' : undefined}
            required
            placeholder="Enter your username"
          />
          {usernameError && (
            <span className="inline-error" id="login-username-error" role="alert">
              {usernameError}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            className={passwordError ? 'invalid' : ''}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? 'login-password-error' : undefined}
            required
            placeholder="Enter your password"
          />
          {passwordError && (
            <span className="inline-error" id="login-password-error" role="alert">
              {passwordError}
            </span>
          )}
        </div>

        <button type="submit" disabled={loading || !isFormValid}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      {error && (
        <div className="message error" role="alert">
          {error}
        </div>
      )}

      <p className="switch-text">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  )
}
