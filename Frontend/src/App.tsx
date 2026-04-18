import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { FilesProvider } from './contexts/FilesContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { UploadPage } from './pages/UploadPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  return (
    <AuthProvider>
      <FilesProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/configuracoes"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </FilesProvider>
    </AuthProvider>
  )
}

export default App
