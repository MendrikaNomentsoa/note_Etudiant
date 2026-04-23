import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllStudents, getBilan } from '../api/students'
import { useToast } from '../context/ToastContext'

// Icônes SVG
const IconUsers = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconTrendUp = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3" />
    <path d="M12 2v8m0 0-3-3m3 3 3-3" />
  </svg>
)

const IconCheck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

const IconX = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

const IconAdd = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
    <circle cx="12" cy="12" r="10" />
  </svg>
)

const IconList = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)

const IconChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 10l3-3 3 3 4-4" />
    <path d="M17 10V4h-3" />
  </svg>
)

export default function DashboardPage() {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    moyenneClasse: 0,
    nbAdmis: 0,
    nbRedoublants: 0,
    meilleurEtudiant: null,
    dernierEtudiant: null
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [topPerformers, setTopPerformers] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [bilanRes, studentsRes] = await Promise.all([
        getBilan(),
        getAllStudents()
      ])
      
      const students = studentsRes.data.data || []
      
      if (bilanRes.data.success && bilanRes.data.data) {
        const bilan = bilanRes.data.data
        setStats({
          totalEtudiants: bilan.totalEtudiants || 0,
          moyenneClasse: bilan.moyenneClasse || 0,
          nbAdmis: bilan.nbAdmis || 0,
          nbRedoublants: bilan.nbRedoublants || 0,
          meilleurEtudiant: bilan.moyenneMax ? 
            students.find(s => s.moyenne === bilan.moyenneMax) : null,
          dernierEtudiant: students[students.length - 1] || null
        })
      }
      
      const top3 = [...students]
        .sort((a, b) => b.moyenne - a.moyenne)
        .slice(0, 3)
      setTopPerformers(top3)
      
      const recent = students.slice(-5).reverse()
      setRecentActivity(recent)
      
    } catch (err) {
      addToast(err.displayMessage || 'Erreur lors du chargement', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="skeleton" style={{ width: 250, height: 36, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 300, height: 20 }} />
        </div>
        <div className="stat-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 130, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-lg)' }} />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tableau de bord</h1>
        <p className="page-subtitle">Vue d'ensemble et actions rapides</p>
      </div>

      <div className="welcome-card">
        <div className="welcome-content">
          <h2>Bienvenue ! 👋</h2>
          <p>Vous avez <strong>{stats.totalEtudiants}</strong> étudiant{stats.totalEtudiants > 1 ? 's' : ''} inscrit{stats.totalEtudiants > 1 ? 's' : ''}</p>
          <div className="welcome-stats">
            <span>✅ Admis: {stats.nbAdmis}</span>
            <span>❌ Redoublants: {stats.nbRedoublants}</span>
            <span>📊 Moyenne: {stats.moyenneClasse.toFixed(1)}/20</span>
          </div>
        </div>
        <div className="welcome-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 2 6 2 9 0v-5" />
            <path d="M12 2v3" />
            <path d="M12 12v3" />
          </svg>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card purple">
          <div className="stat-icon"><IconUsers /></div>
          <div className="stat-value">{stats.totalEtudiants}</div>
          <div className="stat-label">Total étudiants</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon"><IconTrendUp /></div>
          <div className="stat-value">{stats.moyenneClasse.toFixed(1)}</div>
          <div className="stat-label">Moyenne classe /20</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><IconCheck /></div>
          <div className="stat-value">{stats.nbAdmis}</div>
          <div className="stat-label">Étudiants admis</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon"><IconX /></div>
          <div className="stat-value">{stats.nbRedoublants}</div>
          <div className="stat-label">Redoublants</div>
        </div>
      </div>

      <div className="quick-actions">
        <h3 className="section-title">
          <span>⚡</span>
          Actions rapides
        </h3>
        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => navigate('/add')}>
            <span className="action-btn-icon"><IconAdd /></span>
            Ajouter un étudiant
          </button>
          <button className="action-btn secondary" onClick={() => navigate('/students')}>
            <span className="action-btn-icon"><IconList /></span>
            Voir tous les étudiants
          </button>
          <button className="action-btn info" onClick={() => navigate('/bilan')}>
            <span className="action-btn-icon"><IconChart /></span>
            Bilan détaillé
          </button>
        </div>
      </div>

      <div className="top-performers">
        <h3 className="section-title">
          <span>🏆</span>
          Top 3 des meilleurs étudiants
        </h3>
        <div className="podium">
          {topPerformers.map((student, index) => (
            <div key={student._id} className={`podium-card rank-${index + 1}`}>
              <div className="podium-rank">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
              </div>
              <div className="podium-name">{student.nom}</div>
              <div className="podium-num">{student.numEt}</div>
              <div className="podium-moyenne">{student.moyenne.toFixed(2)}/20</div>
              <div className="podium-notes">
                📐{student.note_math} | ⚛️{student.note_phys}
              </div>
            </div>
          ))}
          {topPerformers.length === 0 && (
            <div className="empty-podium">Aucun étudiant pour le moment</div>
          )}
        </div>
      </div>

      <div className="recent-activity">
        <h3 className="section-title">
          <span>🕒</span>
          Derniers inscrits
        </h3>
        {recentActivity.length === 0 ? (
          <div className="empty-activity">
            <p>Aucun étudiant inscrit</p>
            <button className="btn btn-primary" onClick={() => navigate('/add')}>
              <IconAdd /> Ajouter votre premier étudiant
            </button>
          </div>
        ) : (
          <div className="activity-list">
            {recentActivity.map((student) => (
              <div key={student._id} className="activity-item">
                <div className="activity-avatar">
                  {student.nom.charAt(0).toUpperCase()}
                </div>
                <div className="activity-info">
                  <div className="activity-name">{student.nom}</div>
                  <div className="activity-detail">
                    {student.numEt} • Moyenne: {student.moyenne.toFixed(2)}/20
                  </div>
                </div>
                <div className={`activity-status ${student.moyenne >= 10 ? 'status-pass' : 'status-fail'}`}>
                  {student.moyenne >= 10 ? 'Admis ✓' : 'Redoublant ✗'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tips-card">
        <div className="tips-icon">💡</div>
        <div className="tips-content">
          <h4>Conseil du jour</h4>
          <p>La moyenne générale de la classe est de <strong>{stats.moyenneClasse.toFixed(1)}/20</strong>. 
          {stats.moyenneClasse >= 12 
            ? " Excellent travail d'équipe ! Continuez ainsi. 👏" 
            : stats.moyenneClasse >= 10 
              ? " C'est bien, mais il y a encore de la marge pour s'améliorer. 💪"
              : " Il faut plus de travail et de soutien pour les étudiants. 📚"}</p>
        </div>
      </div>
    </div>
  )
}