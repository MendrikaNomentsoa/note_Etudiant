import { useState } from 'react'
import StudentForm from './StudentForm'
import { deleteStudent } from '../api/students'
import { useToast } from '../context/ToastContext'

// Icônes SVG
const IconEdit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3l4 4-7 7H10v-4l7-7z" />
    <path d="M4 20h16" />
  </svg>
)

const IconDelete = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7h16" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M5 7l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
    <path d="M9 3h6" />
  </svg>
)

const IconSortAsc = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
)

const IconSortDesc = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
)

const IconSort = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 10l5-5 5 5M17 14l-5 5-5-5" />
  </svg>
)

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

  const getSortIconComponent = (column) => {
    if (sortBy !== column) return <IconSort />
    return sortOrder === 'asc' ? <IconSortAsc /> : <IconSortDesc />
  }

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
          transition: 'opacity 0.2s',
          display: 'flex',
          alignItems: 'center'
        }}>
          {getSortIconComponent(column)}
        </span>
      </div>
    </th>
  )

  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
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
                      <IconEdit />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteTarget(s)}
                      title="Supprimer"
                    >
                      <IconDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editTarget && (
        <div className="modal-overlay" onClick={() => setEditTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                <IconEdit /> Modifier — {editTarget.nom}
              </span>
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

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                <IconDelete /> Confirmer la suppression
              </span>
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
                {deleting ? <span className="spinner" /> : <IconDelete />}
                {deleting ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}