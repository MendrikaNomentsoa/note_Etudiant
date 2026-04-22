import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

import Navbar          from './components/Navbar'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import DashboardPage   from './pages/DashboardPage'
import AddStudentPage  from './pages/AddStudentPage'
import StudentsPage    from './pages/StudentsPage'
import BilanPage       from './pages/BilanPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading-spinner">Chargement...</div>
  }
  
  return user ? children : <Navigate to="/login" replace />
}

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="page-content">{children}</main>
    </div>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
      />

      {/* Routes publiques */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Routes protégées (nécessitent authentification) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AddStudentPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <AppLayout>
              <StudentsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/bilan"
        element={
          <ProtectedRoute>
            <AppLayout>
              <BilanPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Route 404 - redirection vers l'accueil */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}