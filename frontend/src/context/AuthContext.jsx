import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est stocké dans localStorage
    const storedUser = localStorage.getItem('student_app_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const res = await axios.post('/api/users/login', credentials)
      if (res.data.success) {
        const userData = res.data.user
        localStorage.setItem('student_app_user', JSON.stringify(userData))
        setUser(userData)
        return { success: true }
      }
      return { success: false, message: res.data.message }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Erreur de connexion' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('student_app_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)