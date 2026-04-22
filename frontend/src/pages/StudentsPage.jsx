import { useEffect, useState, useCallback } from 'react'
import { getAllStudents } from '../api/students'
import StudentTable from '../components/StudentTable'
import { useToast } from '../context/ToastContext'

export default function StudentsPage() {
  const { addToast } = useToast()
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterText, setFilterText] = useState('')

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAllStudents()
      setStudents(res.data.data)
      setFilteredStudents(res.data.data)
    } catch (err) {
      addToast(err.displayMessage || 'Erreur lors du chargement', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  // Fonction de tri
  const sortStudents = useCallback((studentsList, sortByValue, sortOrderValue) => {
    const sorted = [...studentsList]
    
    switch (sortByValue) {
      case 'name':
        sorted.sort((a, b) => a.nom.localeCompare(b.nom))
        break
      case 'num':
        sorted.sort((a, b) => a.numEt.localeCompare(b.numEt))
        break
      case 'math':
        sorted.sort((a, b) => a.note_math - b.note_math)
        break
      case 'phys':
        sorted.sort((a, b) => a.note_phys - b.note_phys)
        break
      case 'average':
        sorted.sort((a, b) => a.moyenne - b.moyenne)
        break
      case 'date':
      default:
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
    }
    
    if (sortOrderValue === 'desc') {
      sorted.reverse()
    }
    
    return sorted
  }, [])

  // Fonction de filtrage par recherche
  const filterStudents = useCallback((studentsList, searchText) => {
    if (!searchText.trim()) return studentsList
    
    const lowerSearch = searchText.toLowerCase()
    return studentsList.filter(student => 
      student.nom.toLowerCase().includes(lowerSearch) ||
      student.numEt.toLowerCase().includes(lowerSearch)
    )
  }, [])

  // Appliquer filtrage et tri
  useEffect(() => {
    let result = filterStudents(students, filterText)
    result = sortStudents(result, sortBy, sortOrder)
    setFilteredStudents(result)
  }, [students, filterText, sortBy, sortOrder, filterStudents, sortStudents])

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕️'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  const handleRefresh = () => {
    fetchStudents()
  }

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
            <div className="card-subtitle">Cliquez sur les en-têtes pour trier</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
            <div className="search-bar-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-bar"
                placeholder="Rechercher par nom ou numéro…"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleRefresh}
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
          <>
            <div className="sort-info">
              <span className="sort-info-text">
                📊 Tri par : <strong>
                  {sortBy === 'name' && 'Nom'}
                  {sortBy === 'num' && 'Numéro étudiant'}
                  {sortBy === 'math' && 'Note Mathématiques'}
                  {sortBy === 'phys' && 'Note Physique'}
                  {sortBy === 'average' && 'Moyenne'}
                  {sortBy === 'date' && 'Date d\'ajout'}
                </strong>
                {' '}({sortOrder === 'asc' ? 'Croissant ↑' : 'Décroissant ↓'})
                {filterText && ` | Filtre : "${filterText}" (${filteredStudents.length} résultat${filteredStudents.length !== 1 ? 's' : ''})`}
              </span>
              {(sortBy !== 'date' || filterText) && (
                <button 
                  className="btn-reset"
                  onClick={() => {
                    setSortBy('date')
                    setSortOrder('desc')
                    setFilterText('')
                  }}
                >
                  Réinitialiser
                </button>
              )}
            </div>

            <StudentTable 
              students={filteredStudents} 
              onRefresh={fetchStudents}
              onSort={handleSort}
              sortBy={sortBy}
              sortIcon={getSortIcon}
            />
          </>
        )}
      </div>
    </div>
  )
}