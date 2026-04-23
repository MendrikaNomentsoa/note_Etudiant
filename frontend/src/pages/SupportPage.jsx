import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'

export default function SupportPage() {
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      addToast('Veuillez remplir tous les champs', 'error')
      return
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      addToast('Veuillez entrer un email valide', 'error')
      return
    }

    setLoading(true)
    
    // Simuler l'envoi (à remplacer par un vrai appel API)
    setTimeout(() => {
      addToast('Votre message a été envoyé ! Nous vous répondrons rapidement.', 'success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1500)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🆘 Support technique</h1>
        <p className="page-subtitle">Besoin d'aide ? Contactez notre équipe</p>
      </div>

      <div className="support-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Formulaire de contact */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon">📝</div>
            <div>
              <div className="card-title">Formulaire de contact</div>
              <div className="card-subtitle">Décrivez-nous votre problème</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nom complet *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
              />
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean@example.com"
              />
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Sujet *</label>
              <select
                name="subject"
                className="form-input"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="bug">🐛 Bug / Erreur technique</option>
                <option value="question">❓ Question sur l'utilisation</option>
                <option value="feature">💡 Suggestion d'amélioration</option>
                <option value="account">👤 Problème de compte</option>
                <option value="other">📝 Autre</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Message *</label>
              <textarea
                name="message"
                className="form-input"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez votre problème en détail..."
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 20 }} disabled={loading}>
              {loading ? <span className="spinner" /> : '📤'}
              {loading ? 'Envoi...' : 'Envoyer le message'}
            </button>
          </form>
        </div>

        {/* Informations de contact */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div className="card-icon">📞</div>
              <div>
                <div className="card-title">Contact direct</div>
                <div className="card-subtitle">Nos canaux officiels</div>
              </div>
            </div>
            <div className="contact-channels">
              <div className="channel-item" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.5rem' }}>📧</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Email</div>
                  <a href="mailto:support@gestietudiants.com" style={{ color: 'var(--primary)' }}>support@gestietudiants.com</a>
                </div>
              </div>
              <div className="channel-item" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.5rem' }}>⏰</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Horaires</div>
                  <div style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>Lun-Ven : 9h - 18h</div>
                </div>
              </div>
              <div className="channel-item" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
                <span style={{ fontSize: '1.5rem' }}>⏱️</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Temps de réponse</div>
                  <div style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>24-48h ouvrées</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--success-bg)', borderColor: 'var(--success-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '2rem' }}>💡</span>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Astuce rapide</div>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>
                  Avant de contacter le support, consultez la{' '}
                  <Link to="/docs" style={{ color: 'var(--primary)' }}>documentation</Link> ou la{' '}
                  <Link to="/faq" style={{ color: 'var(--primary)' }}>FAQ</Link>.
                  Vous y trouverez peut-être déjà votre réponse !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}