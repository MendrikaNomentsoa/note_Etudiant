import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function LoginPage() {
  const { login }     = useAuth()
  const { addToast }  = useToast()
  const navigate      = useNavigate()
  const [form, setForm]       = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      addToast('Veuillez remplir tous les champs', 'error')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const result = login(form)
    if (result.success) {
      addToast('Connexion réussie ! Bienvenue 👋', 'success')
      navigate('/dashboard')  // ← Redirection vers dashboard au lieu de students
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
        <p className="login-subtitle">Connectez-vous pour accéder au tableau de bord</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid" style={{ gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Identifiant</label>
              <input
                className="form-input"
                type="text"
                placeholder="admin"
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
                    fontSize: '0.95rem', color: 'var(--text-4)', lineHeight: 1,
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? <span className="spinner" /> : '🔐'}
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </div>
        </form>

        <p className="login-divider">Identifiants de démo</p>
        <div style={{
          background: '#f5f3ff', border: '1px solid #ddd6fe',
          borderRadius: 8, padding: '10px 14px',
          fontSize: '0.83rem', color: '#4b5563', textAlign: 'center',
        }}>
          Login : <strong style={{ color: '#6366f1' }}>admin</strong>
          {' '}/ Mot de passe : <strong style={{ color: '#6366f1' }}>admin123</strong>
        </div>
      </div>
    </div>
  )
}