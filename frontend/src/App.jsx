import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

import Navbar          from './components/Navbar'
import LoginPage       from './pages/LoginPage'
import AddStudentPage  from './pages/AddStudentPage'
import StudentsPage    from './pages/StudentsPage'
import BilanPage       from './pages/BilanPage'

// ─── Route protégée : redirige vers /login si non authentifié ────────────────
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

// ─── Layout principal (avec Navbar latérale) ─────────────────────────────────
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="page-content">{children}</main>
    </div>
  )
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Redirect root */}
      <Route
        path="/"
        element={<Navigate to={user ? '/students' : '/login'} replace />}
      />

      {/* Authentification */}
      <Route path="/login" element={<LoginPage />} />

      {/* Routes protégées */}
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

      {/* 404 */}
      <Route
        path="*"
        element={
          <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            <div style={{ fontSize: '4rem' }}>🔍</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Page introuvable</h2>
            <p style={{ color: 'var(--text-secondary)' }}>La page que vous cherchez n'existe pas.</p>
            <Navigate to="/" replace />
          </div>
        }
      />
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