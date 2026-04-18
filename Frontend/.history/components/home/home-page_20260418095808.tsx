import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { NebulaLogo } from "@/components/nebula-logo";
import { Button } from "@/components/ui/button";
import { Globe, Zap, Shield, Server, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Globe,
      title: "Distribuição Global",
      description:
        "CDN em 200+ edge locations para acesso rápido em qualquer lugar",
    },
    {
      icon: Zap,
      title: "Processamento Rápido",
      description: "Pipelines serverless otimizados para máximo desempenho",
    },
    {
      icon: Shield,
      title: "Segurança Enterprise",
      description: "Criptografia AES-256 + JWT com compliance de segurança",
    },
    {
      icon: Server,
      title: "Alta Disponibilidade",
      description: "99.99% uptime garantido com redundância geográfica",
    },
  ];

  const useCases = [
    {
      title: "Streaming de Vídeo",
      description:
        "Entregue conteúdo de vídeo de alta qualidade com transcodificação automática",
    },
    {
      title: "Processamento de Imagens",
      description: "Redimensione, converta e otimize imagens em tempo real",
    },
    {
      title: "Armazenamento Seguro",
      description: "Guarde seus arquivos com criptografia de nível empresarial",
    },
    {
      title: "Análise de Mídia",
      description:
        "Extraia metadados e insights de seus arquivos automaticamente",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <NebulaLogo size="md" />
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 px-3 py-2 rounded transition-all cursor-pointer"
              >
                Recursos
              </a>
              <a
                href="#use-cases"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("use-cases")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 px-3 py-2 rounded transition-all cursor-pointer"
              >
                Casos de Uso
              </a>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 px-3 py-2 rounded transition-all cursor-pointer"
              >
                Preços
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {isAuthenticated ? (
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/auth")}
                    className="text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => navigate("/auth")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Começar
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-foreground"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-3">
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 px-3 py-2 rounded transition-all cursor-pointer"
              >
                Recursos
              </a>
              <a
                href="#use-cases"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("use-cases")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 px-3 py-2 rounded transition-all cursor-pointer"
              >
                Casos de Uso
              </a>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 px-3 py-2 rounded transition-all cursor-pointer"
              >
                Preços
              </a>
              {isAuthenticated ? (
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/auth")}
                    className="w-full text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => navigate("/auth")}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Começar
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <NebulaLogo size="lg" />
          </div>

          {/* Main heading */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Gerenciamento de mídia
              <br />
              <span className="text-primary">sem limites.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Infraestrutura serverless de classe mundial para processar,
              armazenar e distribuir seus arquivos de mídia com segurança e
              velocidade.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              onClick={() => navigate("/auth")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base font-medium glow-cyan"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary h-12 px-8 text-base font-medium transition-all"
            >
              Ver Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-12">
            <div>
              <p className="text-3xl font-bold text-primary">200+</p>
              <p className="text-sm text-muted-foreground">Locais CDN</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">99.99%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">&lt;100ms</p>
              <p className="text-sm text-muted-foreground">Latência Global</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Recursos Poderosos
            </h2>
            <p className="text-lg text-muted-foreground">
              Tudo que você precisa para gerenciar mídia em escala
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-lg border border-border bg-background/50 hover:bg-background/80 hover:border-primary/50 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Casos de Uso
            </h2>
            <p className="text-lg text-muted-foreground">
              Soluções para diferentes necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-all"
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Planos de Preço
            </h2>
            <p className="text-lg text-muted-foreground">
              Escolha o plano certo para suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <div className="p-8 rounded-lg border border-border bg-background/50 hover:border-primary/50 hover:bg-background/80 transition-all">
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Starter
              </h3>
              <p className="text-muted-foreground mb-6">
                Para pequenos projetos
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">$29</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="text-foreground">✓ 100GB de armazenamento</li>
                <li className="text-foreground">✓ CDN em 50 locais</li>
                <li className="text-foreground">✓ Suporte por email</li>
                <li className="text-muted-foreground">✗ API customizada</li>
              </ul>
              <Button
                onClick={() => navigate("/auth")}
                className="w-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary bg-background"
                variant="outline"
              >
                Começar
              </Button>
            </div>

            {/* Professional Plan */}
            <div className="p-8 rounded-lg border-2 border-primary bg-background/50 hover:bg-background/80 transition-all relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Recomendado
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Professional
              </h3>
              <p className="text-muted-foreground mb-6">
                Para empresas em crescimento
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">$99</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="text-foreground">✓ 1TB de armazenamento</li>
                <li className="text-foreground">✓ CDN em 200+ locais</li>
                <li className="text-foreground">✓ Suporte prioritário 24/7</li>
                <li className="text-foreground">✓ API customizada</li>
              </ul>
              <Button
                onClick={() => navigate("/auth")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-cyan-sm"
              >
                Começar
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-lg border border-border bg-background/50 hover:border-primary/50 hover:bg-background/80 transition-all">
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Enterprise
              </h3>
              <p className="text-muted-foreground mb-6">
                Para grandes organizações
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">
                  Customizado
                </span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="text-foreground">✓ Armazenamento ilimitado</li>
                <li className="text-foreground">✓ CDN + Edge Computing</li>
                <li className="text-foreground">✓ SLA garantido 99.99%</li>
                <li className="text-foreground">✓ Suporte dedicated</li>
              </ul>
              <Button
                onClick={() => navigate("/auth")}
                className="w-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary bg-background"
                variant="outline"
              >
                Falar com vendas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground">
            Junte-se a milhares de empresas que confiam na Nebula Archive
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base font-medium glow-cyan"
          >
            Criar Conta Grátis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-background/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Recursos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Preços
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Segurança
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Sobre
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacidade
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Termos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Social</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <NebulaLogo size="sm" />
              <span>© 2026 Nebula Archive. Todos os direitos reservados.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Status
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                API Docs
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
