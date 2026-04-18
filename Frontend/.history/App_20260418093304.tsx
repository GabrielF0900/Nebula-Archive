import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthContext } from './lib/auth-context'
import AuthPage from './components/auth/auth-page'
import DashboardPage from './components/dashboard/dashboard-page'
import { Toaster } from './components/ui/toaster'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="nebula-theme">
      <AuthContext>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<DashboardPage />} />
        </Routes>
        <Toaster />
      </AuthContext>
    </ThemeProvider>
  )
}
