import { useState, type FormEvent } from 'react'
import './App.css'

interface UserResponse {
  id: number
  username: string
}

interface ApiError {
  detail: string
}

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<UserResponse | null>(null)
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
    setSuccess(null)

    try {
      const res = await fetch('http://localhost:8000/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const body: ApiError = await res.json()
        throw new Error(body.detail || 'Something went wrong')
      }

      const data: UserResponse = await res.json()
      setSuccess(data)
      setUsername('')
      setPassword('')
      setTouched({ username: false, password: false })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="card">
        <h1>Create Account</h1>
        <p className="subtitle">Sign up to get started</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, username: true }))}
              className={usernameError ? 'invalid' : ''}
              required
              placeholder="3-50 characters"
            />
            {usernameError && <span className="inline-error">{usernameError}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              className={passwordError ? 'invalid' : ''}
              required
              placeholder="6-50 characters"
            />
            {passwordError && <span className="inline-error">{passwordError}</span>}
          </div>

          <button type="submit" disabled={loading || !isFormValid}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        {error && <div className="message error">{error}</div>}
        {success && (
          <div className="message success">
            User <strong>{success.username}</strong> created (ID: {success.id})
          </div>
        )}
      </div>
    </div>
  )
}

export default App
