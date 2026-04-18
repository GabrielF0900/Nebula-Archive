import { cn } from "@/lib/utils";

interface NebulaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function NebulaLogo({ className, size = "md" }: NebulaLogoProps) {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative", sizes[size])}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("h-full w-auto", sizes[size])}
        >
          {/* Outer ring */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="url(#gradient1)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Inner orbital path */}
          <ellipse
            cx="20"
            cy="20"
            rx="12"
            ry="6"
            stroke="url(#gradient2)"
            strokeWidth="1"
            fill="none"
            transform="rotate(-30 20 20)"
          />
          {/* Core */}
          <circle cx="20" cy="20" r="4" fill="url(#gradient3)" />
          {/* Orbital dots */}
          <circle cx="32" cy="14" r="1.5" fill="#00D4FF" />
          <circle cx="8" cy="26" r="1" fill="#00D4FF" opacity="0.6" />
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="gradient2" x1="8" y1="20" x2="32" y2="20">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id="gradient3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00FFFF" />
              <stop offset="100%" stopColor="#00D4FF" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground",
            size === "sm" && "text-base",
            size === "md" && "text-lg",
            size === "lg" && "text-xl",
          )}
        >
          Nebula
        </span>
        <span
          className={cn(
            "text-muted-foreground tracking-widest uppercase",
            size === "sm" && "text-[8px]",
            size === "md" && "text-[9px]",
            size === "lg" && "text-[10px]",
          )}
        >
          Archive
        </span>
      </div>
    </div>
  );
}
