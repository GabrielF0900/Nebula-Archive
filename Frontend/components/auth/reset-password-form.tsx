import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { NebulaLogo } from "@/components/nebula-logo";
import { ArrowLeft, ArrowRight, Mail, CheckCircle, Home } from "lucide-react";

interface ResetPasswordFormProps {
  onSwitchToLogin: () => void;
}

export function ResetPasswordForm({ onSwitchToLogin }: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar email");
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="glass rounded-lg p-8 space-y-6 text-center">
          <div className="flex justify-center mb-6">
            <NebulaLogo size="lg" />
          </div>

          <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Email enviado
            </h1>
            <p className="text-sm text-muted-foreground">
              Enviamos instruções de recuperação para{" "}
              <strong className="text-foreground">{email}</strong>. Verifique
              sua caixa de entrada.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              onClick={onSwitchToLogin}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Voltar ao login
            </Button>
            <p className="text-xs text-muted-foreground">
              Não recebeu o email?{" "}
              <button
                onClick={() => setSubmitted(false)}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Tentar novamente
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="glass rounded-lg p-8 space-y-6 relative">
        {/* Home Button - Top Left */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 -left-48 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary hover:text-primary-foreground px-2 py-1 rounded transition-all"
        >
          <Home className="h-4 w-4" />
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

          <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Recuperar senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Digite seu email para receber instruções de recuperação
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
                Enviar instruções
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Back to login */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </button>
        </div>
      </div>
    </div>
  );
}
