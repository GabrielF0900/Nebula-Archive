import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { User, AuthState } from "./types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  loadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

console.log("API URL:", API_URL);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setState((prev) => ({ ...prev, isAuthenticated: true }));
      // Carregar dados do usuário
      loadUserProfile(token);
    }
  }, []);

  const loadUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        setState((prev) => ({
          ...prev,
          user: {
            id: String(user.id),
            username: user.username,
            email: user.email,
            createdAt: new Date(user.createdAt),
          },
          isAuthenticated: true,
        }));
      } else {
        // Token inválido, fazer logout
        localStorage.removeItem("access_token");
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao fazer login");
      }

      const data = await response.json();
      const token = data.access_token;

      // Salvar token
      localStorage.setItem("access_token", token);

      // Carregar dados do usuário
      await loadUserProfile(token);
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Erro ao criar conta");
        }

        const data = await response.json();
        const token = data.access_token;

        // Salvar token
        localStorage.setItem("access_token", token);

        // Carregar dados do usuário e fazer auto-login
        await loadUserProfile(token);
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Implementar quando houver endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      await loadUserProfile(token);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        resetPassword,
        loadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
