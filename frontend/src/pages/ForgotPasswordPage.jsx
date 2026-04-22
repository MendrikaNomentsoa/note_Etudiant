import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import axios from 'axios'

export default function ForgotPasswordPage() {
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      addToast('Veuillez entrer votre email', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/users/forgot-password', { email })
      addToast(res.data.message, 'success')
      setSubmitted(true)
    } catch (err) {
      addToast(err.response?.data?.message || 'Erreur lors de la demande', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="icon">🔐</div>
        </div>
        <h1 className="login-title">Mot de passe oublié</h1>
        <p className="login-subtitle">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📧</div>
            <p style={{ color: 'var(--text-2)', marginBottom: '20px' }}>
              Un email vous a été envoyé avec un lien pour réinitialiser votre mot de passe.
              Vérifiez votre boîte de réception (et vos spams).
            </p>
            <Link to="/login" className="btn btn-primary btn-full">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <span className="spinner" /> : '📧'}
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>

            <p className="login-divider">Retour à la connexion</p>
            <Link to="/login" className="btn btn-secondary btn-full" style={{ textAlign: 'center', display: 'block' }}>
              Se connecter
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}