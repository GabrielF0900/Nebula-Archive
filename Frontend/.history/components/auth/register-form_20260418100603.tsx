import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { NebulaLogo } from "@/components/nebula-logo";
import { Eye, EyeOff, ArrowRight, Shield, Check, Home } from "lucide-react";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const passwordRequirements = [
    { label: "Mínimo 8 caracteres", met: password.length >= 8 },
    { label: "Uma letra maiúscula", met: /[A-Z]/.test(password) },
    { label: "Um número", met: /[0-9]/.test(password) },
    {
      label: "Senhas coincidem",
      met: password === confirmPassword && password.length > 0,
    },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!allRequirementsMet) {
      setError("Por favor, atenda todos os requisitos de senha");
      return;
    }

    try {
      await register(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="glass rounded-lg p-4 space-y-2 relative">
        {/* Home Button - Top Left */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-0 pl-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary hover:text-primary-foreground px-2 py-1 rounded transition-all"
        >
          <Home className="h-4 w-4" />
          Página Inicial
        </button>
        {/* Header */}
        <div className="text-center space-y-1 pt-4">
          <div className="flex justify-center mb-3">
            <button
              onClick={() => navigate("/")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <NebulaLogo size="lg" />
            </button>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Criar conta
          </h1>
          <p className="text-sm text-muted-foreground">
            Comece a gerenciar suas mídias com segurança
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-muted-foreground">
                Nome completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">
                Email corporativo
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm text-muted-foreground"
              >
                Senha
              </Label>
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

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm text-muted-foreground"
              >
                Confirmar senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>

            {/* Password requirements */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {passwordRequirements.map((req, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-xs transition-colors ${
                    req.met ? "text-success" : "text-muted-foreground"
                  }`}
                >
                  <Check
                    className={`h-3 w-3 ${
                      req.met ? "opacity-100" : "opacity-30"
                    }`}
                  />
                  {req.label}
                </div>
              ))}
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
            disabled={isLoading || !allRequirementsMet}
          >
            {isLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <>
                Criar conta
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Login link */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Entrar
            </button>
          </p>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-border">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">
            Proteção empresarial com criptografia AES-256
          </span>
        </div>
      </div>
    </div>
  );
}
