import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ─── Intercepteur : log des erreurs réseau ────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || 'Erreur réseau, veuillez réessayer.'
    return Promise.reject({ ...error, displayMessage: message })
  }
)

// ─── Étudiants ────────────────────────────────────────────────────────────

/** Récupère tous les étudiants */
export const getAllStudents = () => api.get('/students')

/** Récupère un étudiant par son ID MongoDB */
export const getStudentById = (id) => api.get(`/students/${id}`)

/** Crée un nouvel étudiant */
export const createStudent = (data) => api.post('/students', data)

/** Met à jour un étudiant */
export const updateStudent = (id, data) => api.put(`/students/${id}`, data)

/** Supprime un étudiant */
export const deleteStudent = (id) => api.delete(`/students/${id}`)

/** Récupère le bilan global de la classe */
export const getBilan = () => api.get('/students/bilan')
