import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import axios from 'axios'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [activeTab, setActiveTab] = useState('info')
  const [showPass, setShowPass] = useState(false)
  
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    username: ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({})

  // Charger les informations utilisateur
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/users/profile', {
          headers: { 'x-user-id': user?.id }
        })
        if (res.data.success) {
          setUserInfo({
            fullName: res.data.user.fullName || '',
            email: res.data.user.email || '',
            username: res.data.user.username || ''
          })
        }
      } catch (err) {
        addToast('Erreur lors du chargement du profil', 'error')
      } finally {
        setFetching(false)
      }
    }
    
    if (user?.id) {
      fetchProfile()
    } else {
      setFetching(false)
    }
  }, [user, addToast])

  const handleInfoChange = (e) => {
    const { name, value } = e.target
    setUserInfo(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleUpdateInfo = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await axios.put('/api/users/profile', 
        {
          fullName: userInfo.fullName,
          email: userInfo.email
        },
        {
          headers: { 'x-user-id': user?.id }
        }
      )
      
      if (res.data.success) {
        addToast(res.data.message, 'success')
        // Mettre à jour l'utilisateur dans le contexte
        const updatedUser = { ...user, fullName: userInfo.fullName, email: userInfo.email }
        localStorage.setItem('student_app_user', JSON.stringify(updatedUser))
        // Forcer un rechargement de la page pour mettre à jour l'affichage
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Erreur lors de la mise à jour', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    
    const errs = {}
    if (!passwordForm.currentPassword) errs.currentPassword = 'Mot de passe actuel requis'
    if (!passwordForm.newPassword) errs.newPassword = 'Nouveau mot de passe requis'
    if (passwordForm.newPassword.length < 6) errs.newPassword = 'Minimum 6 caractères'
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errs.confirmPassword = 'Les mots de passe ne correspondent pas'
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    
    setLoading(true)
    
    try {
      const res = await axios.put('/api/users/profile',
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        {
          headers: { 'x-user-id': user?.id }
        }
      )
      
      if (res.data.success) {
        addToast(res.data.message, 'success')
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        // Déconnecter l'utilisateur après changement de mot de passe
        setTimeout(() => {
          addToast('Veuillez vous reconnecter avec votre nouveau mot de passe', 'info')
          logout()
          navigate('/login')
        }, 2000)
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Erreur lors du changement de mot de passe', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="login-page">
        <div className="login-box" style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '20px auto', width: 30, height: 30 }} />
          <p>Chargement du profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mon profil</h1>
        <p className="page-subtitle">Gérez vos informations personnelles</p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        {/* Onglets */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('info')}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'info' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'info' ? 'var(--primary)' : 'var(--text-3)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'var(--transition)'
            }}
          >
            📝 Informations personnelles
          </button>
          <button
            onClick={() => setActiveTab('password')}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'password' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'password' ? 'var(--primary)' : 'var(--text-3)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'var(--transition)'
            }}
          >
            🔒 Changer mot de passe
          </button>
        </div>

        {/* Onglet Informations */}
        {activeTab === 'info' && (
          <form onSubmit={handleUpdateInfo}>
            <div className="form-group">
              <label className="form-label">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                className="form-input"
                value={userInfo.username}
                disabled
                style={{ background: 'var(--bg)', cursor: 'not-allowed' }}
              />
              <span className="form-hint">Le nom d'utilisateur ne peut pas être modifié</span>
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">
                Nom complet <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                value={userInfo.fullName}
                onChange={handleInfoChange}
                placeholder="Votre nom complet"
                required
              />
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={userInfo.email}
                onChange={handleInfoChange}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : '💾'}
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Onglet Mot de passe */}
        {activeTab === 'password' && (
          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label className="form-label">
                Mot de passe actuel <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  name="currentPassword"
                  className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Votre mot de passe actuel"
                  style={{ paddingRight: 42 }}
                  required
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
              {errors.currentPassword && <span className="form-error">{errors.currentPassword}</span>}
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">
                Nouveau mot de passe <span className="required">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Minimum 6 caractères"
                required
              />
              {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">
                Confirmer le nouveau mot de passe <span className="required">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Retapez votre nouveau mot de passe"
                required
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : '🔒'}
                {loading ? 'Modification...' : 'Changer le mot de passe'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="card" style={{ maxWidth: 600, marginTop: 16, background: '#eff6ff', borderColor: '#bfdbfe' }}>
        <p style={{ fontSize: '0.83rem', color: '#374151' }}>
          💡 <strong>Conseil de sécurité :</strong> Utilisez un mot de passe fort, d'au moins 6 caractères,
          avec des lettres et des chiffres. Ne partagez jamais vos identifiants.
        </p>
      </div>
    </div>
  )
}