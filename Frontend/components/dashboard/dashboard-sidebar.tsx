import { cn } from "@/lib/utils";
import { NebulaLogo } from "@/components/nebula-logo";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  Settings,
  Globe,
  Activity,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "files", label: "Arquivos", icon: FolderOpen },
  { id: "distribution", label: "Distribuição", icon: Globe },
  { id: "monitoring", label: "Monitoramento", icon: Activity },
];

const bottomItems = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "settings", label: "Configurações", icon: Settings },
];

export function DashboardSidebar({
  isCollapsed,
  onToggle,
  activeSection,
  onSectionChange,
}: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40",
        "flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!isCollapsed && <NebulaLogo size="sm" />}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "h-8 w-8 p-0 text-muted-foreground hover:text-foreground",
            isCollapsed && "mx-auto",
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all",
              activeSection === item.id
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-primary/20 hover:text-foreground",
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 flex-shrink-0",
                activeSection === item.id && "text-primary-foreground",
              )}
            />
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom Menu Items */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all",
              activeSection === item.id
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-primary/20 hover:text-foreground",
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
