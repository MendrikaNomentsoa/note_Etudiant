import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { createStudent, updateStudent } from '../api/students'

// Icônes SVG
const IconSave = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
)

const IconAdd = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
    <circle cx="12" cy="12" r="10" />
  </svg>
)

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const IconHash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
)

const IconMath = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v16M4 12h16" />
    <circle cx="12" cy="12" r="10" />
  </svg>
)

const IconPhys = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15 15 0 0 0 0 20 15 15 0 0 0 0-20z" />
  </svg>
)

const IconCancel = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const defaultForm = { numEt: '', nom: '', note_math: '', note_phys: '' }

export default function StudentForm({ initialData = null, onSuccess, onCancel }) {
  const isEdit = !!initialData
  const { addToast } = useToast()

  const [form, setForm] = useState(initialData || defaultForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const previewMoyenne =
    form.note_math !== '' && form.note_phys !== ''
      ? ((parseFloat(form.note_math) + parseFloat(form.note_phys)) / 2).toFixed(2)
      : null

  const validate = () => {
    const errs = {}
    if (!form.numEt.trim())        errs.numEt    = 'Le numéro étudiant est requis'
    if (!form.nom.trim())          errs.nom      = 'Le nom est requis'

    const math = parseFloat(form.note_math)
    const phys = parseFloat(form.note_phys)

    if (form.note_math === '')      errs.note_math = 'Note requise'
    else if (isNaN(math) || math < 0 || math > 20)
                                   errs.note_math = 'Note entre 0 et 20'

    if (form.note_phys === '')      errs.note_phys = 'Note requise'
    else if (isNaN(phys) || phys < 0 || phys > 20)
                                   errs.note_phys = 'Note entre 0 et 20'

    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const payload = {
        numEt:     form.numEt,
        nom:       form.nom,
        note_math: parseFloat(form.note_math),
        note_phys: parseFloat(form.note_phys),
      }

      if (isEdit) {
        const res = await updateStudent(initialData._id, payload)
        addToast(res.data.message, 'success')
      } else {
        const res = await createStudent(payload)
        addToast(res.data.message, 'success')
        setForm(defaultForm)
      }
      onSuccess?.()
    } catch (err) {
      addToast(err.displayMessage || 'Insertion échouée', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            <IconHash /> Numéro étudiant <span className="required">*</span>
          </label>
          <input
            className={`form-input ${errors.numEt ? 'error' : ''}`}
            name="numEt"
            value={form.numEt}
            onChange={handleChange}
            placeholder="ex : ET-2024-001"
            disabled={isEdit}
          />
          {errors.numEt && <span className="form-error">{errors.numEt}</span>}
          {isEdit && <span className="form-hint">Non modifiable</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <IconUser /> Nom complet <span className="required">*</span>
          </label>
          <input
            className={`form-input ${errors.nom ? 'error' : ''}`}
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="ex : DUPONT Jean"
          />
          {errors.nom && <span className="form-error">{errors.nom}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <IconMath /> Note Mathématiques <span className="required">*</span>
          </label>
          <input
            className={`form-input ${errors.note_math ? 'error' : ''}`}
            name="note_math"
            type="number"
            min="0" max="20" step="0.25"
            value={form.note_math}
            onChange={handleChange}
            placeholder="0 – 20"
          />
          {errors.note_math && <span className="form-error">{errors.note_math}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <IconPhys /> Note Physique <span className="required">*</span>
          </label>
          <input
            className={`form-input ${errors.note_phys ? 'error' : ''}`}
            name="note_phys"
            type="number"
            min="0" max="20" step="0.25"
            value={form.note_phys}
            onChange={handleChange}
            placeholder="0 – 20"
          />
          {errors.note_phys && <span className="form-error">{errors.note_phys}</span>}
        </div>
      </div>

      {previewMoyenne !== null && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(139,92,246,0.1)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.2)' }}>
          <span style={{ color: '#a78bfa', fontSize: '0.9rem', fontWeight: 600 }}>
            Moyenne calculée : {previewMoyenne} / 20
            <span style={{ marginLeft: 12 }} className={`badge ${parseFloat(previewMoyenne) >= 10 ? 'badge-success' : 'badge-danger'}`}>
              {parseFloat(previewMoyenne) >= 10 ? 'Admis ✓' : 'Redoublant ✗'}
            </span>
          </span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : isEdit ? <IconSave /> : <IconAdd />}
          {loading ? 'Traitement…' : isEdit ? 'Enregistrer' : 'Ajouter étudiant'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            <IconCancel /> Annuler
          </button>
        )}
      </div>
    </form>
  )
}