import { useState } from 'react'
import StudentForm from './StudentForm'
import { deleteStudent } from '../api/students'
import { useToast } from '../context/ToastContext'

export default function StudentTable({ students, onRefresh }) {
  const { addToast } = useToast()
  const [editTarget, setEditTarget]     = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)
  const [search, setSearch]             = useState('')

  const filtered = students.filter(
    (s) =>
      s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.numEt.toLowerCase().includes(search.toLowerCase())
  )

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await deleteStudent(deleteTarget._id)
      addToast(res.data.message, 'success')
      onRefresh()
    } catch (err) {
      addToast(err.displayMessage || 'Suppression échouée', 'error')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <>
      {/* Search */}
      <div className="toolbar">
        <div className="search-bar-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-bar"
            placeholder="Rechercher par nom ou numéro…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {filtered.length} étudiant{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <div className="empty-title">Aucun étudiant trouvé</div>
          <p className="empty-text">
            {search ? 'Essayez un autre terme de recherche.' : 'Commencez par ajouter un étudiant.'}
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>N° Étudiant</th>
                <th>Nom</th>
                <th style={{ textAlign: 'center' }}>Math</th>
                <th style={{ textAlign: 'center' }}>Physique</th>
                <th style={{ textAlign: 'center' }}>Moyenne</th>
                <th style={{ textAlign: 'center' }}>Statut</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr key={s._id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{idx + 1}</td>
                  <td className="td-num">{s.numEt}</td>
                  <td className="td-name">{s.nom}</td>
                  <td className="td-note">{s.note_math}</td>
                  <td className="td-note">{s.note_phys}</td>
                  <td className={`td-avg ${s.moyenne >= 10 ? 'avg-pass' : 'avg-fail'}`}>
                    {s.moyenne?.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${s.moyenne >= 10 ? 'badge-success' : 'badge-danger'}`}>
                      {s.moyenne >= 10 ? '✓ Admis' : '✗ Redoublant'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => setEditTarget(s)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(s)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Modification */}
      {editTarget && (
        <div className="modal-overlay" onClick={() => setEditTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">✏️ Modifier — {editTarget.nom}</span>
              <button className="modal-close" onClick={() => setEditTarget(null)}>✕</button>
            </div>
            <StudentForm
              initialData={editTarget}
              onSuccess={() => { setEditTarget(null); onRefresh() }}
              onCancel={() => setEditTarget(null)}
            />
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">⚠️ Confirmer la suppression</span>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
              Vous allez supprimer définitivement :
            </p>
            <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>
              {deleteTarget.nom}
              <span style={{ color: 'var(--purple-4)', marginLeft: 8, fontSize: '0.9rem' }}>
                ({deleteTarget.numEt})
              </span>
            </p>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? <span className="spinner" /> : '🗑️'}
                {deleting ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
