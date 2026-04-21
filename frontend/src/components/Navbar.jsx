import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/add',      icon: '➕', label: 'Ajout étudiant' },
  { to: '/students', icon: '📋', label: 'Liste & CRUD'   },
  { to: '/bilan',    icon: '📊', label: 'Bilan classe'   },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <div className="brand-icon">🎓</div>
        <span>GestiÉtudiants</span>
      </NavLink>

      <ul className="navbar-nav">
        {navItems.map(({ to, icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="navbar-user">
        <div className="user-badge">
          <div className="user-avatar">
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <span className="user-name">{user?.username || 'admin'}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </nav>
  )
}
