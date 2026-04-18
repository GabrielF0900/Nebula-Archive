import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { mockFiles } from "@/lib/mock-data";
import type { MediaFile } from "@/lib/types";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { UploadDropzone } from "./upload-dropzone";
import { FileList } from "./file-list";
import { StatsCards } from "./stats-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List } from "lucide-react";

export function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [files, setFiles] = useState<MediaFile[]>(mockFiles);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Simulate short polling for status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          // Simulate processing completion
          if (file.status === "processing" && Math.random() > 0.7) {
            return {
              ...file,
              status: "processed" as const,
              processedAt: new Date(),
              downloadUrl: `https://cdn.nebula.io/files/${file.name}`,
            };
          }
          // Simulate pending to processing
          if (file.status === "pending" && Math.random() > 0.8) {
            return {
              ...file,
              status: "processing" as const,
            };
          }
          return file;
        }),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const handleUploadComplete = useCallback(() => {
    // Add a new file to the list
    const newFile: MediaFile = {
      id: `file_${Date.now()}`,
      name: `uploaded_file_${Date.now()}.mp4`,
      size: Math.floor(Math.random() * 1_000_000_000),
      type: "video/mp4",
      status: "pending",
      uploadedAt: new Date(),
    };
    setFiles((prev) => [newFile, ...prev]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <DashboardHeader sidebarCollapsed={sidebarCollapsed} />

      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          sidebarCollapsed ? "pl-16" : "pl-64",
        )}
      >
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              {activeSection === "dashboard" && "Dashboard"}
              {activeSection === "upload" && "Upload de Arquivos"}
              {activeSection === "files" && "Gerenciador de Arquivos"}
              {activeSection === "distribution" && "Distribuição"}
              {activeSection === "monitoring" && "Monitoramento"}
              {activeSection === "settings" && "Configurações"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeSection === "dashboard" &&
                "Visão geral do seu ambiente de mídia"}
              {activeSection === "upload" &&
                "Upload direto para S3 via Presigned URLs"}
              {activeSection === "files" && "Gerencie e monitore seus arquivos"}
              {activeSection === "distribution" &&
                "Configurações de CDN e Edge Locations"}
              {activeSection === "monitoring" &&
                "Métricas e logs de processamento"}
              {activeSection === "settings" &&
                "Configurações da sua conta e preferências"}
            </p>
          </div>

          {/* Dashboard content */}
          {activeSection === "dashboard" && (
            <div className="space-y-8">
              <StatsCards files={files} />

              {/* Quick upload */}
              <div className="glass-light rounded-lg p-6 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Upload Rápido
                </h2>
                <UploadDropzone onUploadComplete={handleUploadComplete} />
              </div>

              {/* Recent files */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Arquivos Recentes
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        viewMode === "list"
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        viewMode === "grid"
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <FileList
                  files={files.slice(0, 5)}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />
              </div>
            </div>
          )}

          {/* Upload section */}
          {activeSection === "upload" && (
            <div className="glass-light rounded-lg p-6 border border-border">
              <UploadDropzone onUploadComplete={handleUploadComplete} />
            </div>
          )}

          {/* Files section */}
          {activeSection === "files" && (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="processed">Processados</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="errors">Erros</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <FileList
                  files={files}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />
              </TabsContent>
              <TabsContent value="processed">
                <FileList
                  files={files.filter((f) => f.status === "processed")}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />
              </TabsContent>
              <TabsContent value="pending">
                <FileList
                  files={files.filter(
                    (f) => f.status === "pending" || f.status === "processing",
                  )}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />
              </TabsContent>
              <TabsContent value="errors">
                <FileList
                  files={files.filter((f) => f.status === "error")}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />
              </TabsContent>
            </Tabs>
          )}

          {/* Distribution section */}
          {activeSection === "distribution" && (
            <div className="glass-light rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Edge Locations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    code: "GRU",
                    name: "São Paulo",
                    status: "active",
                    latency: "12ms",
                  },
                  {
                    code: "IAD",
                    name: "Virginia",
                    status: "active",
                    latency: "89ms",
                  },
                  {
                    code: "FRA",
                    name: "Frankfurt",
                    status: "active",
                    latency: "145ms",
                  },
                  {
                    code: "NRT",
                    name: "Tokyo",
                    status: "active",
                    latency: "215ms",
                  },
                  {
                    code: "SYD",
                    name: "Sydney",
                    status: "active",
                    latency: "280ms",
                  },
                  {
                    code: "CDG",
                    name: "Paris",
                    status: "active",
                    latency: "152ms",
                  },
                ].map((location) => (
                  <div
                    key={location.code}
                    className="p-4 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-primary">
                        {location.code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-xs text-success">Ativo</span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{location.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Latência: {location.latency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monitoring section */}
          {activeSection === "monitoring" && (
            <div className="glass-light rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Status do Sistema
              </h2>
              <div className="space-y-4">
                {[
                  {
                    name: "S3 Storage",
                    status: "operational",
                    uptime: "99.99%",
                  },
                  {
                    name: "Lambda Processing",
                    status: "operational",
                    uptime: "99.95%",
                  },
                  {
                    name: "CloudFront CDN",
                    status: "operational",
                    uptime: "100%",
                  },
                  {
                    name: "API Gateway",
                    status: "operational",
                    uptime: "99.98%",
                  },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-sm text-foreground">
                        {service.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-success font-medium">
                        Operacional
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uptime: {service.uptime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings section */}
          {activeSection === "settings" && (
            <div className="glass-light rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Configurações da Conta
              </h2>
              <p className="text-sm text-muted-foreground">
                Configurações de conta e preferências em breve.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
