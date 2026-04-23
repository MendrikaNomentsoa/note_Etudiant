import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function LoginPage() {
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const canvasRef = useRef(null)

  // Effet de particules
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.color = `rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.min(100, Math.floor(window.innerWidth / 20))
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      // Dessiner les connexions entre particules proches
      ctx.beginPath()
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`
            ctx.stroke()
          }
        }
      }
      animationId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener('resize', () => {
      resizeCanvas()
      initParticles()
    })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Charger les identifiants sauvegardés
  useEffect(() => {
    const savedUsername = localStorage.getItem('remembered_username')
    if (savedUsername) {
      setForm(prev => ({ ...prev, username: savedUsername }))
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      addToast('Veuillez remplir tous les champs', 'error')
      return
    }
    setLoading(true)
    const result = await login(form)
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('remembered_username', form.username)
      } else {
        localStorage.removeItem('remembered_username')
      }
      addToast('Connexion réussie ! Bienvenue 👋', 'success')
      navigate('/dashboard')
    } else {
      addToast(result.message, 'error')
    }
    setLoading(false)
  }

  const features = [
    { icon: '📊', text: 'Calcul automatique des moyennes', svg: 'chart' },
    { icon: '📈', text: 'Bilan de classe détaillé', svg: 'stats' },
    { icon: '👥', text: 'Gestion complète des étudiants', svg: 'users' },
    { icon: '🌙', text: 'Mode sombre inclus', svg: 'moon' },
    { icon: '📱', text: 'Responsive design', svg: 'responsive' },
    { icon: '🔒', text: 'Sécurité des données', svg: 'security' }
  ]

  // Composants SVG
  const ChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2M7 10l3-3 3 3 4-4" />
      <path d="M17 10V4h-3" />
    </svg>
  )

  const StatsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3" />
      <path d="M12 2v8m0 0-3-3m3 3 3-3" />
    </svg>
  )

  const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )

  const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )

  const ResponsiveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="16" y2="10" />
    </svg>
  )

  const SecurityIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v7c0 5 9 8 9 8s9-3 9-8V7l-9-5z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </svg>
  )

  const getSvgIcon = (svgName) => {
    switch(svgName) {
      case 'chart': return <ChartIcon />
      case 'stats': return <StatsIcon />
      case 'users': return <UsersIcon />
      case 'moon': return <MoonIcon />
      case 'responsive': return <ResponsiveIcon />
      case 'security': return <SecurityIcon />
      default: return null
    }
  }

  return (
    <div className="login-page-split">
      {/* Canvas pour les particules */}
      <canvas ref={canvasRef} className="particles-canvas" />
      
      {/* Section gauche - Illustration et fonctionnalités */}
      <div className="login-hero">
        <div className="hero-bg-animation">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-logo">
            <div className="hero-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 2 6 2 9 0v-5" />
                <path d="M12 2v3" />
                <path d="M12 12v3" />
              </svg>
            </div>
            <h2>GestiÉtudiants</h2>
          </div>
          <p className="hero-description">
            La solution complète pour la gestion académique moderne
          </p>
          <div className="hero-features">
            {features.map((feature, index) => (
              <div key={index} className="hero-feature" style={{ animationDelay: `${index * 0.1}s` }}>
                <span className="feature-icon">
                  {getSvgIcon(feature.svg)}
                </span>
                <span className="feature-text">{feature.text}</span>
              </div>
            ))}
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Étudiants gérés</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Disponible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire de connexion */}
      <div className="login-form-container">
        <div className="login-box-split">
          <div className="form-header">
            <div className="form-logo">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v7c0 5 9 8 9 8s9-3 9-8V7l-9-5z" />
                <path d="M12 10v4" />
                <circle cx="12" cy="16" r="0.5" fill="currentColor" />
              </svg>
            </div>
            <h1 className="form-title">Connexion</h1>
            <p className="form-subtitle">Bienvenue ! Veuillez vous connecter à votre compte</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group-split">
              <label className="form-label-split">
                <span className="label-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                Nom d'utilisateur
              </label>
              <input
                className="form-input-split"
                type="text"
                placeholder="ex: jdupont"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="form-group-split">
              <label className="form-label-split">
                <span className="label-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                Mot de passe
              </label>
              <div className="password-wrapper">
                <input
                  className="form-input-split"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="password-toggle-split"
                  title={showPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="login-options-split">
              <label className="checkbox-label-split">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className="forgot-link-split">
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" className="btn-login-split" disabled={loading}>
              {loading ? <span className="spinner-split" /> : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              )}
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="register-section">
            <div className="divider-split">
              <span>ou</span>
            </div>
            <Link to="/register" className="btn-register-split">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Créer un compte
            </Link>
          </div>

          <div className="footer-note">
            <p>Application sécurisée 🔒</p>
          </div>
        </div>
      </div>
    </div>
  )
}