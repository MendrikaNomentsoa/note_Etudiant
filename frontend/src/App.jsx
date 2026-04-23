import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'

import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import DashboardPage   from './pages/DashboardPage'
import AddStudentPage  from './pages/AddStudentPage'
import StudentsPage    from './pages/StudentsPage'
import BilanPage       from './pages/BilanPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProfilePage from './pages/ProfilePage'
import DocumentationPage from './pages/DocumentationPage'
import FaqPage from './pages/FaqPage'
import SupportPage from './pages/SupportPage'
import PrivacyPage from './pages/legal/PrivacyPage'
import TermsPage from './pages/legal/TermsPage'
import CookiesPage from './pages/legal/CookiesPage'

// Bouton pour basculer entre mode clair et sombre
function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme()
  return (
    <button className="theme-toggle" onClick={toggleDarkMode}>
      {darkMode ? '☀️' : '🌙'}
    </button>
  )
}

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
      <Footer />
      <ThemeToggle />
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

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Routes Ressources */}
      <Route
        path="/docs"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DocumentationPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/faq"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FaqPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SupportPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Routes légales */}
      <Route
        path="/privacy"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PrivacyPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/terms"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TermsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cookies"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CookiesPage />
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
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}