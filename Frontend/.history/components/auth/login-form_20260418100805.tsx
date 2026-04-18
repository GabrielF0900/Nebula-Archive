import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { NebulaLogo } from "@/components/nebula-logo";
import { Eye, EyeOff, ArrowRight, Shield, Lock, Home } from "lucide-react";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToReset: () => void;
}

export function LoginForm({
  onSwitchToRegister,
  onSwitchToReset,
}: LoginFormProps) {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="glass rounded-lg p-8 space-y-8 relative">
        {/* Home Button - Top Left */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-0 pl-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary hover:text-primary-foreground px-2 py-1 rounded transition-all"
        >
          <Home className="h-4 w-1" />
          Página Inicial
        </button>
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => navigate("/")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <NebulaLogo size="lg" />
            </button>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-muted-foreground">
            Acesse sua conta para gerenciar seus arquivos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm text-muted-foreground"
                >
                  Senha
                </Label>
                <button
                  type="button"
                  onClick={onSwitchToReset}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium glow-cyan-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <>
                Entrar
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-4 text-muted-foreground">ou</span>
          </div>
        </div>

        {/* Register link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Criar conta
            </button>
          </p>
        </div>

        {/* Security badges */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>JWT Auth</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span>TLS 1.3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
