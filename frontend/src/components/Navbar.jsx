import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'

const navItems = [
  { to: '/dashboard', label: 'Tableau de bord' },
  { to: '/add', label: 'Ajout étudiant' },
  { to: '/students', label: 'Liste & CRUD' },
  { to: '/bilan', label: 'Bilan classe' },
  { to: '/profile', label: 'Mon profil' },
]

// Icônes SVG
const Icons = {
  dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  add: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  students: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  bilan: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3" />
      <path d="M12 2v8m0 0-3-3m3 3 3-3" />
    </svg>
  ),
  profile: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth')
    return saved ? parseInt(saved) : 280
  })
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef(null)

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen')
    if (savedState !== null) {
      setIsOpen(savedState === 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth)
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${sidebarWidth}px`
    }
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`)
  }, [sidebarWidth])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }
  }, [isOpen])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        let newWidth = e.clientX
        newWidth = Math.min(Math.max(newWidth, 200), 400)
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    if (isResizing) {
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, setSidebarWidth])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsOpen(false)
  }

  const toggleMenu = () => {
    const newState = !isOpen
    setIsOpen(newState)
    localStorage.setItem('sidebarOpen', newState)
  }

  const closeMenu = () => {
    setIsOpen(false)
    localStorage.setItem('sidebarOpen', false)
  }

  const startResizing = (e) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const getInitial = () => {
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase()
    if (user?.username) return user.username.charAt(0).toUpperCase()
    return 'A'
  }

  const getDisplayName = () => {
    if (user?.fullName) return user.fullName
    if (user?.username) return user.username
    return 'Utilisateur'
  }

  const getIcon = (to) => {
    switch(to) {
      case '/dashboard': return <Icons.dashboard />
      case '/add': return <Icons.add />
      case '/students': return <Icons.students />
      case '/bilan': return <Icons.bilan />
      case '/profile': return <Icons.profile />
      default: return null
    }
  }

  return (
    <>
      <button className={`menu-toggle-btn ${isOpen ? 'menu-open' : ''}`} onClick={toggleMenu} aria-label="Menu">
        <span className="menu-icon">{isOpen ? '✕' : '☰'}</span>
      </button>

      <aside 
        ref={sidebarRef}
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        style={{ width: sidebarWidth }}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 2 6 2 9 0v-5" />
                <path d="M12 2v3" />
                <path d="M12 12v3" />
              </svg>
            </div>
            <span>GestiÉtudiants</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="sidebar-link-icon">{getIcon(to)}</span>
              <span className="sidebar-link-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {getInitial()}
            </div>
            <div className="user-info">
              <span className="user-name">{getDisplayName()}</span>
              <span className="user-role">{user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</span>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <span className="logout-icon"><Icons.logout /></span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="resize-handle"
          onMouseDown={startResizing}
          title="Tirer pour redimensionner"
        >
          <div className="resize-grip">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </>
  )
}