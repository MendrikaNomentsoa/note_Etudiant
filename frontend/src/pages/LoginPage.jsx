import { useState } from 'react'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      addToast('Veuillez remplir tous les champs', 'error')
      return
    }
    setLoading(true)
    const result = await login(form)
    if (result.success) {
      addToast('Connexion réussie ! Bienvenue 👋', 'success')
      navigate('/dashboard')
    } else {
      addToast(result.message, 'error')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="icon">🎓</div>
        </div>
        <h1 className="login-title">GestiÉtudiants</h1>
        <p className="login-subtitle">Connectez-vous à votre compte</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid" style={{ gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Nom d'utilisateur</label>
              <input
                className="form-input"
                type="text"
                placeholder="jdupont"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
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
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <span className="spinner" /> : '🔐'}
                {loading ? 'Connexion...' : 'Se connecter'}
            </button>

                  <Link to="/forgot-password" style={{ 
                             display: 'block', 
                            textAlign: 'center', 
                            fontSize: '0.8rem', 
                            color: 'var(--primary)', 
                            textDecoration: 'none',
                            marginTop: '12px'
                          }}>
                            Mot de passe oublié ?
                    </Link>
          </div>
        </form>

        <p className="login-divider">Pas encore de compte ?</p>
        <Link to="/register" className="btn btn-secondary btn-full" style={{ textAlign: 'center', display: 'block' }}>
          Créer un compte
        </Link>
      </div>
    </div>
  )
}