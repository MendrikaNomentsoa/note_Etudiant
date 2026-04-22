import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllStudents, getBilan } from '../api/students'
import { useToast } from '../context/ToastContext'

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
      
      // Top 3 meilleurs étudiants
      const top3 = [...students]
        .sort((a, b) => b.moyenne - a.moyenne)
        .slice(0, 3)
      setTopPerformers(top3)
      
      // Dernières activités (simulées avec les 5 derniers ajouts/modifications)
      const recent = students.slice(-5).reverse()
      setRecentActivity(recent)
      
    } catch (err) {
      addToast(err.displayMessage || 'Erreur lors du chargement', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tableau de bord</h1>
        <p className="page-subtitle">Vue d'ensemble et actions rapides</p>
      </div>

      {loading ? (
        <div className="skeleton-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Cartes de bienvenue et stats rapides */}
          <div className="welcome-card">
            <div className="welcome-content">
              <h2>Bienvenue ! 👋</h2>
              <p>Vous avez <strong>{stats.totalEtudiants}</strong> étudiants inscrits</p>
              <div className="welcome-stats">
                <span>✅ Admis: {stats.nbAdmis}</span>
                <span>❌ Redoublants: {stats.nbRedoublants}</span>
                <span>📊 Moyenne classe: {stats.moyenneClasse.toFixed(1)}/20</span>
              </div>
            </div>
            <div className="welcome-icon">🎓</div>
          </div>

          {/* Actions rapides */}
          <div className="quick-actions">
            <h3 className="section-title">Actions rapides</h3>
            <div className="action-buttons">
              <button className="action-btn primary" onClick={() => navigate('/add')}>
                <span className="action-btn-icon">➕</span>
                Ajouter un étudiant
              </button>
              <button className="action-btn secondary" onClick={() => navigate('/students')}>
                <span className="action-btn-icon">📋</span>
                Voir tous les étudiants
              </button>
              <button className="action-btn info" onClick={() => navigate('/bilan')}>
                <span className="action-btn-icon">📊</span>
                Bilan détaillé
              </button>
            </div>
          </div>

          {/* Top 3 meilleurs étudiants */}
          <div className="top-performers">
            <h3 className="section-title">🏆 Top 3 des meilleurs étudiants</h3>
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

          {/* Activité récente */}
          <div className="recent-activity">
            <h3 className="section-title">🕒 Derniers inscrits</h3>
            {recentActivity.length === 0 ? (
              <div className="empty-activity">
                <p>Aucun étudiant inscrit</p>
                <button className="btn btn-primary" onClick={() => navigate('/add')}>
                  Ajouter votre premier étudiant
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

          {/* Conseils rapides */}
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
        </>
      )}
    </div>
  )
}