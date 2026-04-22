import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const navItems = [
  { to: '/add',      icon: '➕', label: 'Ajout étudiant' },
  { to: '/students', icon: '📋', label: 'Liste & CRUD'   },
  { to: '/bilan',    icon: '📊', label: 'Bilan classe'   },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsOpen(false)
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Bouton menu flottant (toujours visible) */}
      <button className="menu-toggle-btn" onClick={toggleMenu} aria-label="Menu">
        <span className="menu-icon">{isOpen ? '✕' : '☰'}</span>
      </button>

      {/* Overlay (fond sombre) quand le menu est ouvert */}
      {isOpen && <div className="sidebar-overlay" onClick={closeMenu} />}

      {/* Sidebar latérale */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">🎓</div>
            <span>GestiÉtudiants</span>
          </div>
          <button className="sidebar-close" onClick={closeMenu}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="sidebar-link-icon">{icon}</span>
              <span className="sidebar-link-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.username || 'admin'}</span>
              <span className="user-role">Administrateur</span>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  )
}