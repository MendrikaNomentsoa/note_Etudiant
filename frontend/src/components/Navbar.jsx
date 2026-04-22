import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/add',       icon: '➕', label: 'Ajout étudiant' },
  { to: '/students',  icon: '📋', label: 'Liste & CRUD'   },
  { to: '/bilan',     icon: '📊', label: 'Bilan classe'   },
  { to: '/profile',   icon: '👤', label: 'Mon profil'     }, 
]

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

  // Sauvegarder l'état du menu dans localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen')
    if (savedState !== null) {
      setIsOpen(savedState === 'true')
    }
  }, [])

  // Sauvegarder la largeur de la sidebar
  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth)
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${sidebarWidth}px`
    }
    // Mettre à jour le padding-left du contenu
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`)
  }, [sidebarWidth])

  // Ajouter/supprimer la classe sur le body pour le décalage du contenu
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }
  }, [isOpen])

  // Gestion du redimensionnement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        let newWidth = e.clientX
        // Limiter la largeur entre 200px et 400px
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

  // Récupérer l'initiale du nom d'utilisateur
  const getInitial = () => {
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase()
    if (user?.username) return user.username.charAt(0).toUpperCase()
    return 'A'
  }

  // Récupérer le nom à afficher
  const getDisplayName = () => {
    if (user?.fullName) return user.fullName
    if (user?.username) return user.username
    return 'Utilisateur'
  }

  return (
    <>
      {/* Bouton menu flottant */}
      <button className={`menu-toggle-btn ${isOpen ? 'menu-open' : ''}`} onClick={toggleMenu} aria-label="Menu">
        <span className="menu-icon">{isOpen ? '✕' : '☰'}</span>
      </button>

      {/* Sidebar latérale redimensionnable */}
      <aside 
        ref={sidebarRef}
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        style={{ width: sidebarWidth }}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">🎓</div>
            <span>GestiÉtudiants</span>
          </div>
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
              {getInitial()}
            </div>
            <div className="user-info">
              <span className="user-name">{getDisplayName()}</span>
              <span className="user-role">{user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</span>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Poignée de redimensionnement */}
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