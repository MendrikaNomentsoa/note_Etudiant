import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import axios from 'axios'

export default function RegisterPage() {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.username.trim()) errs.username = "Nom d'utilisateur requis"
    if (form.username.length < 3) errs.username = "Minimum 3 caractères"
    if (!form.email.trim()) errs.email = "Email requis"
    if (!form.email.includes('@')) errs.email = "Email invalide"
    if (!form.fullName.trim()) errs.fullName = "Nom complet requis"
    if (!form.password) errs.password = "Mot de passe requis"
    if (form.password.length < 6) errs.password = "Minimum 6 caractères"
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Les mots de passe ne correspondent pas"
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/users/register', {
        username: form.username,
        email: form.email,
        fullName: form.fullName,
        password: form.password
      })

      addToast(res.data.message, 'success')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      addToast(err.response?.data?.message || "Erreur lors de l'inscription", 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="icon">📝</div>
        </div>
        <h1 className="login-title">Inscription</h1>
        <p className="login-subtitle">Créez votre compte</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Nom complet *</label>
              <input
                className={`form-input ${errors.fullName ? 'error' : ''}`}
                type="text"
                name="fullName"
                placeholder="Jean Dupont"
                value={form.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Nom d'utilisateur *</label>
              <input
                className={`form-input ${errors.username ? 'error' : ''}`}
                type="text"
                name="username"
                placeholder="jdupont"
                value={form.username}
                onChange={handleChange}
              />
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                className={`form-input ${errors.email ? 'error' : ''}`}
                type="email"
                name="email"
                placeholder="jean@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe *</label>
              <div style={{ position: 'relative' }}>
                <input
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.95rem', color: 'var(--text-4)'
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirmer le mot de passe *</label>
              <input
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <span className="spinner" /> : '📝'}
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </div>
        </form>

        <p className="login-divider">Déjà un compte ?</p>
        <Link to="/login" className="btn btn-secondary btn-full" style={{ textAlign: 'center', display: 'block' }}>
          Se connecter
        </Link>
      </div>
    </div>
  )
}