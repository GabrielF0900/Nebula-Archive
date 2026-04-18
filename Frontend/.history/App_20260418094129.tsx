import { ThemeProvider } from "./components/theme-provider";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { AuthPage } from "./components/auth/auth-page";
import { DashboardPage } from "./components/dashboard/dashboard-page";
import { Toaster } from "./components/ui/toaster";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/auth"
        element=(
          <AuthRoute>
            <AuthPage />
          </AuthRoute>
        )
      />
      <Route
        path="/dashboard"
        element=(
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="nebula-theme">
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
