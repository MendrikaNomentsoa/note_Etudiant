import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('student_app_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (credentials) => {
    // Authentification simulée (pas de backend auth)
    // Remplacer par un vrai appel API + JWT si besoin
    if (
      credentials.username === 'admin' &&
      credentials.password === 'admin123'
    ) {
      const userData = { username: 'admin', role: 'Administrateur' }
      localStorage.setItem('student_app_user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    }
    return { success: false, message: 'Identifiants incorrects' }
  }

  const logout = () => {
    localStorage.removeItem('student_app_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
