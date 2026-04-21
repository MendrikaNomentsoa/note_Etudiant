import { useEffect, useState, useCallback } from 'react'
import { getAllStudents } from '../api/students'
import StudentTable from '../components/StudentTable'
import { useToast } from '../context/ToastContext'

export default function StudentsPage() {
  const { addToast } = useToast()
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAllStudents()
      setStudents(res.data.data)
    } catch (err) {
      addToast(err.displayMessage || 'Erreur lors du chargement', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Liste des étudiants</h1>
        <p className="page-subtitle">Consultez, modifiez ou supprimez les étudiants enregistrés.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">📋</div>
          <div>
            <div className="card-title">Tableau des étudiants</div>
            <div className="card-subtitle">Cliquez sur ✏️ pour modifier ou 🗑️ pour supprimer</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={fetchStudents}
              disabled={loading}
            >
              {loading
                ? <span className="spinner" style={{ width: 12, height: 12, borderTopColor: '#6b7280', borderColor: '#d1d5db' }} />
                : '🔄'}
              Actualiser
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 48, borderRadius: 8 }} />
            ))}
          </div>
        ) : (
          <StudentTable students={students} onRefresh={fetchStudents} />
        )}
      </div>
    </div>
  )
}