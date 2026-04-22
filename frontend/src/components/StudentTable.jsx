import { useState } from 'react'
import StudentForm from './StudentForm'
import { deleteStudent } from '../api/students'
import { useToast } from '../context/ToastContext'

export default function StudentTable({ students, onRefresh, onSort, sortBy, sortIcon }) {
  const { addToast } = useToast()
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

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

  // Fonction pour rendre le header de colonne avec bouton de tri
  const SortableHeader = ({ column, label, align = 'left' }) => (
    <th 
      style={{ textAlign: align, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => onSort(column)}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        {label}
        <span style={{ 
          fontSize: '0.8rem', 
          opacity: sortBy === column ? 1 : 0.4,
          transition: 'opacity 0.2s'
        }}>
          {sortIcon(column)}
        </span>
      </div>
    </th>
  )

  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎓</div>
        <div className="empty-title">Aucun étudiant trouvé</div>
        <p className="empty-text">
          Commencez par ajouter un étudiant ou modifiez vos critères de recherche.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: 50 }}>#</th>
              <SortableHeader column="num" label="N° Étudiant" />
              <SortableHeader column="name" label="Nom" />
              <SortableHeader column="math" label="Math" align="center" />
              <SortableHeader column="phys" label="Physique" align="center" />
              <SortableHeader column="average" label="Moyenne" align="center" />
              <th style={{ textAlign: 'center' }}>Statut</th>
              <th style={{ textAlign: 'center', width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
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