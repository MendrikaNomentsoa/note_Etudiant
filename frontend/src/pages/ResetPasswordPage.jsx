import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import axios from 'axios'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  // Vérifier le token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.get(`/api/users/verify-reset-token/${token}`)
        if (res.data.success) {
          setValidToken(true)
        } else {
          setValidToken(false)
        }
      } catch (err) {
        setValidToken(false)
        addToast(err.response?.data?.message || 'Lien invalide ou expiré', 'error')
      } finally {
        setVerifying(false)
      }
    }
    verifyToken()
  }, [token, addToast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const errs = {}
    if (!form.password) errs.password = 'Mot de passe requis'
    if (form.password.length < 6) errs.password = 'Minimum 6 caractères'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Les mots de passe ne correspondent pas'
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(`/api/users/reset-password/${token}`, {
        password: form.password,
        confirmPassword: form.confirmPassword
      })
      
      addToast(res.data.message, 'success')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      addToast(err.response?.data?.message || 'Erreur lors de la réinitialisation', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="login-page">
        <div className="login-box" style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '20px auto', width: 30, height: 30 }} />
          <p>Vérification du lien...</p>
        </div>
      </div>
    )
  }

  if (!validToken) {
    return (
      <div className="login-page">
        <div className="login-box" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏰</div>
          <h2 className="login-title">Lien expiré</h2>
          <p style={{ color: 'var(--text-3)', marginBottom: '24px' }}>
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <Link to="/forgot-password" className="btn btn-primary btn-full">
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="icon">🔒</div>
        </div>
        <h1 className="login-title">Nouveau mot de passe</h1>
        <p className="login-subtitle">Choisissez un mot de passe sécurisé</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nouveau mot de passe *</label>
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

          <div className="form-group" style={{ marginTop: 16 }}>
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
            {loading ? <span className="spinner" /> : '🔒'}
            {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>

          <p className="login-divider">Retour à la connexion</p>
          <Link to="/login" className="btn btn-secondary btn-full" style={{ textAlign: 'center', display: 'block' }}>
            Se connecter
          </Link>
        </form>
      </div>
    </div>
  )
}