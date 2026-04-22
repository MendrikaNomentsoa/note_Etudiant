import { useNavigate } from 'react-router-dom'

export default function RecentStudents({ students, loading, onRefresh }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-icon">🕒</div>
          <div>
            <div className="card-title">Derniers étudiants ajoutés</div>
            <div className="card-subtitle">Chargement...</div>
          </div>
        </div>
        <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-md)' }} />
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">🕒</div>
        <div>
          <div className="card-title">Derniers étudiants ajoutés</div>
          <div className="card-subtitle">Les 5 étudiants les plus récents</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/students')}>
            Voir tout →
          </button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="empty-state" style={{ padding: 40 }}>
          <div className="empty-icon">👨‍🎓</div>
          <div className="empty-title">Aucun étudiant</div>
          <p className="empty-text">Commencez par ajouter un étudiant</p>
          <button className="btn btn-primary" onClick={() => navigate('/add')} style={{ marginTop: 16 }}>
            ➕ Ajouter un étudiant
          </button>
        </div>
      ) : (
        <div className="recent-table">
          <table>
            <thead>
              <tr>
                <th>N° Étudiant</th>
                <th>Nom</th>
                <th>Math</th>
                <th>Physique</th>
                <th>Moyenne</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="td-num">{student.numEt}</td>
                  <td className="td-name">{student.nom}</td>
                  <td className="td-note">{student.note_math}</td>
                  <td className="td-note">{student.note_phys}</td>
                  <td className={`td-avg ${student.moyenne >= 10 ? 'avg-pass' : 'avg-fail'}`}>
                    {student.moyenne?.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${student.moyenne >= 10 ? 'badge-success' : 'badge-danger'}`}>
                      {student.moyenne >= 10 ? '✓ Admis' : '✗ Redoublant'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => navigate(`/students`)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}