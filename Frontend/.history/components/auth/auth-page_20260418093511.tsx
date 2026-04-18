import { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ResetPasswordForm } from "./reset-password-form";
import { Globe, Zap, Shield, Server } from "lucide-react";

type AuthView = "login" | "register" | "reset";

export function AuthPage() {
  const [view, setView] = useState<AuthView>("login");

  const features = [
    {
      icon: Globe,
      title: "Distribuição Global",
      description: "CDN em 200+ edge locations",
    },
    {
      icon: Zap,
      title: "Processamento Rápido",
      description: "Pipelines serverless otimizados",
    },
    {
      icon: Shield,
      title: "Segurança Enterprise",
      description: "Criptografia AES-256 + JWT",
    },
    {
      icon: Server,
      title: "Alta Disponibilidade",
      description: "99.99% uptime garantido",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Features */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-background relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gradient orb */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <div className="mb-12">
            <h1 className="text-3xl xl:text-4xl font-semibold text-foreground mb-4 tracking-tight">
              Gerenciamento de mídia
              <br />
              <span className="text-primary">sem limites.</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Infraestrutura serverless de classe mundial para processar, armazenar
              e distribuir seus arquivos de mídia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground mb-4">
              Infraestrutura confiável por empresas líderes
            </p>
            <div className="flex items-center gap-8 opacity-40">
              {["AWS", "CloudFront", "Lambda", "S3"].map((tech) => (
                <span key={tech} className="text-sm font-mono text-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-card">
        <div className="w-full max-w-md">
          {view === "login" && (
            <LoginForm
              onSwitchToRegister={() => setView("register")}
              onSwitchToReset={() => setView("reset")}
            />
          )}
          {view === "register" && (
            <RegisterForm onSwitchToLogin={() => setView("login")} />
          )}
          {view === "reset" && (
            <ResetPasswordForm onSwitchToLogin={() => setView("login")} />
          )}
        </div>
      </div>
    </div>
  );
}
