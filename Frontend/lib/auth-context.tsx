import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { User, AuthState } from "./types";
import { useNotification } from "@/hooks/use-notification";
import { NotificationTemplates } from "@/lib/notification-service";

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

const API_URL = "/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { notify } = useNotification();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  // Carregar e validar perfil do usuário
  const loadUserProfile = useCallback(
    async (token: string): Promise<boolean> => {
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
            isLoading: false,
          }));
          return true;
        } else {
          console.warn("Token inválido - fazendo logout");
          localStorage.removeItem("access_token");
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        localStorage.removeItem("access_token");
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return false;
      }
    },
    [],
  );

  // Validar token ao montar (apenas se existir)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      loadUserProfile(token);
    }
  }, [loadUserProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
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
        const success = await loadUserProfile(token);
        if (!success) {
          throw new Error("Falha ao carregar perfil do usuário");
        }

        // Mostrar notificação de sucesso
        const state = await loadUserProfile(token);
        if (state) {
          const notificationUser = JSON.parse(
            localStorage.getItem("user") || "{}",
          );
          const notification = NotificationTemplates.auth.loginSuccess(
            notificationUser.username || email,
          );
          notify(notification);
        }
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";
        const notification =
          NotificationTemplates.auth.loginError(errorMessage);
        notify(notification);
        throw error;
      }
    },
    [loadUserProfile, notify],
  );

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
        const success = await loadUserProfile(token);
        if (!success) {
          throw new Error("Falha ao carregar perfil do usuário");
        }

        // Mostrar notificação de sucesso
        const notification =
          NotificationTemplates.auth.registerSuccess(username);
        notify(notification);
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";
        const notification =
          NotificationTemplates.auth.registerError(errorMessage);
        notify(notification);
        throw error;
      }
    },
    [loadUserProfile, notify],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Mostrar notificação de logout
    const notification = NotificationTemplates.auth.logoutSuccess();
    notify(notification);
  }, [notify]);

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
      setState((prev) => ({ ...prev, isLoading: true }));
      await loadUserProfile(token);
    }
  }, [loadUserProfile]);

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
