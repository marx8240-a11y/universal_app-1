import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState({ username: false, password: false })

  const usernameError =
    touched.username && username.length > 0 && username.length < 3
      ? 'Username must be at least 3 characters'
      : touched.username && username.length > 50
        ? 'Username must be 50 characters or fewer'
        : null

  const passwordError =
    touched.password && password.length > 0 && password.length < 6
      ? 'Password must be at least 6 characters'
      : touched.password && password.length > 50
        ? 'Password must be 50 characters or fewer'
        : null

  const isFormValid =
    username.length >= 3 &&
    username.length <= 50 &&
    password.length >= 6 &&
    password.length <= 50

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.register(username, password)
      navigate('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1>Create Account</h1>
      <p className="subtitle">Sign up to get started</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, username: true }))}
            className={usernameError ? 'invalid' : ''}
            aria-invalid={!!usernameError}
            aria-describedby={usernameError ? 'reg-username-error' : undefined}
            required
            placeholder="3-50 characters"
          />
          {usernameError && (
            <span className="inline-error" id="reg-username-error" role="alert">
              {usernameError}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            className={passwordError ? 'invalid' : ''}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? 'reg-password-error' : undefined}
            required
            placeholder="6-50 characters"
          />
          {passwordError && (
            <span className="inline-error" id="reg-password-error" role="alert">
              {passwordError}
            </span>
          )}
        </div>

        <button type="submit" disabled={loading || !isFormValid}>
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>

      {error && (
        <div className="message error" role="alert">
          {error}
        </div>
      )}

      <p className="switch-text">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}
