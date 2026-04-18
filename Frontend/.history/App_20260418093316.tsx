import { ThemeProvider } from './components/theme-provider'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth-context'
import AuthPage from './components/auth/auth-page'
import DashboardPage from './components/dashboard/dashboard-page'
import { Toaster } from './components/ui/toaster'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="nebula-theme">
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<DashboardPage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
