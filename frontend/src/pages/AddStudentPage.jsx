import StudentForm from '../components/StudentForm'
import { useNavigate } from 'react-router-dom'

export default function AddStudentPage() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Ajouter un étudiant</h1>
        <p className="page-subtitle">Remplissez le formulaire — la moyenne est calculée automatiquement.</p>
      </div>

      <div className="card" style={{ maxWidth: 680 }}>
        <div className="card-header">
          <div className="card-icon">➕</div>
          <div>
            <div className="card-title">Nouvel étudiant</div>
            <div className="card-subtitle">Tous les champs marqués * sont obligatoires</div>
          </div>
        </div>
        <StudentForm onSuccess={() => navigate('/students')} />
      </div>

      {/* Info card */}
      <div className="card" style={{
        maxWidth: 680, marginTop: 14, padding: 16,
        background: '#eff6ff', borderColor: '#bfdbfe',
      }}>
        <p style={{ fontSize: '0.83rem', color: '#374151' }}>
          💡 <strong>Calcul de la moyenne :</strong> (Note Maths + Note Physique) ÷ 2.
          Un étudiant est{' '}
          <span style={{ color: '#059669', fontWeight: 600 }}>admis</span> si sa moyenne est ≥ 10.
        </p>
      </div>
    </div>
  )
}