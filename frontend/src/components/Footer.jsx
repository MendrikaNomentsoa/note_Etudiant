import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { getAllStudents, getBilan } from '../api/students'

export default function Footer() {
  const { darkMode } = useTheme()
  const location = useLocation()
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [stats, setStats] = useState({
    studentsCount: 0,
    averageNote: 0,
    admisCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer le nombre total d'étudiants
        const studentsRes = await getAllStudents()
        const students = studentsRes.data.data || []
        
        // Récupérer le bilan pour la moyenne et le nombre d'admis
        const bilanRes = await getBilan()
        const bilan = bilanRes.data.data
        
        setStats({
          studentsCount: students.length,
          averageNote: bilan?.moyenneClasse || 0,
          admisCount: bilan?.nbAdmis || 0
        })
      } catch (error) {
        console.error('Erreur lors du chargement des stats footer:', error)
        // En cas d'erreur, essayer de récupérer depuis le localStorage comme fallback
        try {
          const cachedStudents = localStorage.getItem('students_count')
          if (cachedStudents) {
            setStats(prev => ({ ...prev, studentsCount: JSON.parse(cachedStudents) }))
          }
        } catch (e) {}
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
    
    // Rafraîchir les stats toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // Ne pas afficher le footer sur les pages d'authentification
  const hideFooter = ['/login', '/register', '/forgot-password'].includes(location.pathname) || 
                     location.pathname.startsWith('/reset-password')

  if (hideFooter) return null

  return (
    <footer className={`app-footer ${darkMode ? 'dark' : ''}`}>
      <div className="footer-container">
        <div className="footer-grid">
          {/* Colonne 1 - Brand et description */}
          <div className="footer-col">
            <div className="footer-brand">
              <div className="footer-logo">🎓</div>
              <h3>GestiÉtudiants</h3>
            </div>
            <p className="footer-description">
              Application moderne de gestion des étudiants permettant de suivre les performances,
              calculer les moyennes et générer des bilans de classe en temps réel.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.21.68-.48 0-.24-.01-.88-.01-1.73-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.56 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Colonne 2 - Navigation rapide */}
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard">📊 Tableau de bord</Link></li>
              <li><Link to="/students">👥 Liste des étudiants</Link></li>
              <li><Link to="/add">➕ Ajouter un étudiant</Link></li>
              <li><Link to="/bilan">📈 Bilan de classe</Link></li>
              <li><Link to="/profile">👤 Mon profil</Link></li>
            </ul>
          </div>

          {/* Colonne 3 - Ressources */}
          <div className="footer-col">
            <h4>Ressources</h4>
            <ul className="footer-links">
              <li><a href="#">📚 Documentation</a></li>
              <li><a href="#">🎓 Guides d'utilisation</a></li>
              <li><a href="#">💡 FAQ</a></li>
              <li><a href="#">🆘 Support technique</a></li>
              <li><a href="#">📊 API Documentation</a></li>
            </ul>
          </div>

          {/* Colonne 4 - Contact & Infos */}
          <div className="footer-col">
            <h4>Statistiques</h4>
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-number">
                  {loading ? (
                    <span className="skeleton" style={{ width: 40, height: 24, display: 'inline-block' }} />
                  ) : (
                    stats.studentsCount
                  )}
                </span>
                <span className="stat-label">Étudiants suivis</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {loading ? (
                    <span className="skeleton" style={{ width: 40, height: 24, display: 'inline-block' }} />
                  ) : (
                    stats.averageNote.toFixed(1)
                  )}
                </span>
                <span className="stat-label">Moyenne classe</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {loading ? (
                    <span className="skeleton" style={{ width: 40, height: 24, display: 'inline-block' }} />
                  ) : (
                    stats.admisCount
                  )}
                </span>
                <span className="stat-label">Admis</span>
              </div>
            </div>
            <ul className="footer-contact" style={{ marginTop: 20 }}>
              <li>
                <span className="contact-icon">📧</span>
                <a href="mailto:support@gestietudiants.com">support@gestietudiants.com</a>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>Madagascar, Fianarantsoa</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} GestiÉtudiants. Tous droits réservés.</p>
          </div>
          <div className="footer-legal">
            <Link to="/privacy">Confidentialité</Link>
            <span className="separator">•</span>
            <Link to="/terms">Conditions d'utilisation</Link>
            <span className="separator">•</span>
            <Link to="/cookies">Cookies</Link>
          </div>
          <div className="footer-version">
            <span>Version 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}