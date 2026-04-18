import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User, AuthState } from "./types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo
const mockUser: User = {
  id: "usr_1",
  email: "demo@nebula.io",
  name: "Carlos Silva",
  avatar: undefined,
  createdAt: new Date("2024-01-15"),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (email && password) {
      setState({
        user: { ...mockUser, email },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw new Error("Credenciais inválidas");
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (name && email && password) {
      setState({
        user: { ...mockUser, name, email },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw new Error("Dados inválidos");
    }
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setState((prev) => ({ ...prev, isLoading: false }));
    
    if (!email) {
      throw new Error("Email inválido");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
