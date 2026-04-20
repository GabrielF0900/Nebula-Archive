import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { mockFiles } from "@/lib/mock-data";
import type { MediaFile } from "@/lib/types";
import {
  listFiles,
  deleteFile,
  getDistributionInfo,
  getMonitoringMetrics,
  getMonitoringActivity,
  type FileResponse,
  type DistributionResponse,
  type MonitoringMetrics,
} from "@/lib/api";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { UploadDropzone } from "./upload-dropzone";
import { FileList } from "./file-list";
import { StatsCards } from "./stats-cards";
import { ProfilePage } from "./profile-page";
import { SettingsPage } from "./settings-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List } from "lucide-react";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [files, setFiles] = useState<FileResponse[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [distributions, setDistributions] = useState<DistributionResponse[]>(
    [],
  );
  const [metrics, setMetrics] = useState<MonitoringMetrics | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // Mostrar loading enquanto carrega o usuário
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Extrair token do localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);
  }, []);

  const fetchFiles = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoadingFiles(true);
      const response = await listFiles(token);
      setFiles(response);
    } catch (error) {
      console.error("Erro ao buscar arquivos:", error);
    } finally {
      setIsLoadingFiles(false);
    }
  }, [token]);

  // Buscar distribuição
  const fetchDistribution = useCallback(async () => {
    if (!token) return;
    try {
      const response = await getDistributionInfo(token);
      setDistributions(response);
    } catch (error) {
      console.error("Erro ao buscar distribuição:", error);
    }
  }, [token]);

  // Buscar métricas de monitoramento
  const fetchMetrics = useCallback(async () => {
    if (!token) return;
    try {
      const metricsResponse = await getMonitoringMetrics(token);
      const activitiesResponse = await getMonitoringActivity(token);
      setMetrics(metricsResponse);
      setActivities(activitiesResponse);
    } catch (error) {
      console.error("Erro ao buscar métricas:", error);
    }
  }, [token]);

  // Efeitos para cada seção
  useEffect(() => {
    if (activeSection === "dashboard" || activeSection === "files") {
      fetchFiles();
    }
  }, [activeSection, fetchFiles]);

  useEffect(() => {
    if (activeSection === "distribution") {
      fetchDistribution();
    }
  }, [activeSection, fetchDistribution]);

  useEffect(() => {
    if (activeSection === "monitoring") {
      fetchMetrics();
    }
  }, [activeSection, fetchMetrics]);

  // Polling para atualizar status dos arquivos a cada 10 segundos
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      fetchFiles();
    }, 10000);
    return () => clearInterval(interval);
  }, [token, fetchFiles]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const handleUploadComplete = useCallback(() => {
    // Recarregar arquivos após upload
    if (token) {
      fetchFiles();
    }
  }, [token, fetchFiles]);

  const handleDeleteFile = useCallback(
    async (fileId: string) => {
      if (!token) return;
      try {
        await deleteFile(fileId, token);
        // Recarregar lista de arquivos após deletar
        await fetchFiles();
      } catch (error) {
        console.error("Erro ao deletar arquivo:", error);
        alert("Erro ao deletar arquivo");
      }
    },
    [token, fetchFiles],
  );

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
              {activeSection === "dashboard" && `Bem-vindo, ${user?.username}!`}
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
              <StatsCards files={files.filter((f) => f.status !== "deleted")} />

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
                  files={files
                    .filter((f) => f.status !== "deleted")
                    .slice(0, 5)}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                  onDelete={handleDeleteFile}
                  token={token || undefined}
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
                  files={files.filter((f) => f.status !== "deleted")}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                  onDelete={handleDeleteFile}
                  token={token || undefined}
                />
              </TabsContent>
              <TabsContent value="processed">
                <FileList
                  files={files.filter((f) => f.status === "processed")}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                  onDelete={handleDeleteFile}
                  token={token || undefined}
                />
              </TabsContent>
              <TabsContent value="pending">
                <FileList
                  files={files.filter(
                    (f) => f.status === "pending" || f.status === "processing",
                  )}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                  onDelete={handleDeleteFile}
                  token={token || undefined}
                />
              </TabsContent>
              <TabsContent value="errors">
                <FileList
                  files={files.filter((f) => f.status === "error")}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                  onDelete={handleDeleteFile}
                  token={token || undefined}
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
              {isLoading ? (
                <p className="text-muted-foreground">
                  Carregando distribuição...
                </p>
              ) : distributions.length === 0 ? (
                <p className="text-muted-foreground">
                  Nenhuma distribuição disponível
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {distributions.map((location) => (
                    <div
                      key={location.code}
                      className="p-4 rounded-lg bg-muted/30 border border-border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-mono text-sm text-primary font-semibold">
                            {location.code}
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {location.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              location.status === "active"
                                ? "bg-success animate-pulse"
                                : "bg-muted",
                            )}
                          />
                          <span
                            className={cn(
                              "text-xs font-medium",
                              location.status === "active"
                                ? "text-success"
                                : "text-muted-foreground",
                            )}
                          >
                            {location.status === "active" ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      </div>

                      {/* Distribution percentage */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground">
                            Distribuição
                          </span>
                          <span className="text-sm font-semibold text-primary">
                            {location.percentageDistributed}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: location.percentageDistributed,
                            }}
                          />
                        </div>
                      </div>

                      {/* Location details */}
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p className="flex justify-between">
                          <span>Latência:</span>
                          <span className="text-foreground font-medium">
                            {location.latency}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>Banda:</span>
                          <span className="text-foreground font-medium">
                            {location.bandwidth}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>Arquivos:</span>
                          <span className="text-foreground font-medium">
                            {location.filesCount}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>Requisições:</span>
                          <span className="text-foreground font-medium">
                            {location.requests}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Monitoring section */}
          {activeSection === "monitoring" && (
            <div className="space-y-6">
              {/* Metrics Cards */}
              {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-light rounded-lg p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      Total de Uploads
                    </p>
                    <p className="text-2xl font-semibold text-foreground">
                      {metrics.totalUploads}
                    </p>
                  </div>
                  <div className="glass-light rounded-lg p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      Taxa de Sucesso
                    </p>
                    <p className="text-2xl font-semibold text-foreground">
                      {(
                        (metrics.successfulUploads / metrics.totalUploads) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                  <div className="glass-light rounded-lg p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      Tempo Médio
                    </p>
                    <p className="text-2xl font-semibold text-foreground">
                      {metrics.averageProcessingTime.toFixed(2)}s
                    </p>
                  </div>
                  <div className="glass-light rounded-lg p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      Banda Total
                    </p>
                    <p className="text-2xl font-semibold text-foreground">
                      {(metrics.totalBandwidthUsed / 1024 ** 3).toFixed(2)}GB
                    </p>
                  </div>
                </div>
              )}

              {/* Activity Log */}
              <div className="glass-light rounded-lg p-6 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Atividades Recentes
                </h2>
                {activities.length === 0 ? (
                  <p className="text-muted-foreground">
                    Nenhuma atividade registrada
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activities.slice(0, 10).map((activity, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border hover:border-primary/50 transition-colors"
                      >
                        {/* Status Icon */}
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              activity.status === "processed"
                                ? "bg-success animate-pulse"
                                : activity.status === "processing"
                                  ? "bg-warning animate-pulse"
                                  : activity.status === "error"
                                    ? "bg-destructive"
                                    : activity.status === "deleted"
                                      ? "bg-red-500"
                                      : "bg-muted-foreground",
                            )}
                          />
                        </div>

                        {/* Activity Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {activity.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.timestamp).toLocaleDateString(
                              "pt-BR",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={cn(
                            "flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                            activity.status === "processed"
                              ? "bg-success/20 text-success"
                              : activity.status === "processing"
                                ? "bg-warning/20 text-warning"
                                : activity.status === "error"
                                  ? "bg-destructive/20 text-destructive"
                                  : activity.status === "deleted"
                                    ? "bg-red-500/20 text-red-600 line-through"
                                    : "bg-muted/30 text-muted-foreground",
                          )}
                        >
                          {activity.statusLabel || activity.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings section */}
          {activeSection === "settings" && <SettingsPage />}

          {/* Profile section */}
          {activeSection === "profile" && <ProfilePage />}
        </div>
      </main>
    </div>
  );
}
