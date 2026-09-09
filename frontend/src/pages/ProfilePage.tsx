import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to log out?')) return
    logout()
    navigate('/login')
  }

  return (
    <div className="card">
      <h1>Profile</h1>
      <p className="subtitle">Your account details</p>

      <div className="profile-info">
        <div className="profile-row">
          <span className="profile-label">ID</span>
          <span className="profile-value">{user?.id}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Username</span>
          <span className="profile-value">{user?.username}</span>
        </div>
      </div>

      <button type="button" className="logout-btn" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  )
}
