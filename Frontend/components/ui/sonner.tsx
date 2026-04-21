import { useTheme } from "@/components/theme-provider";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "hsl(142.1 76.2% 36.3%)",
          "--success-border": "hsl(142.1 70.6% 45.3%)",
          "--success-text": "hsl(142.1 70.6% 95%)",
          "--error-bg": "hsl(0 84.2% 60.2%)",
          "--error-border": "hsl(0 84.2% 70.2%)",
          "--error-text": "hsl(0 84.2% 95%)",
          "--warning-bg": "hsl(38.6 92.1% 50.2%)",
          "--warning-border": "hsl(38.6 92.1% 60.2%)",
          "--warning-text": "hsl(38.6 92.1% 15%)",
          "--info-bg": "hsl(217.2 91.2% 59.8%)",
          "--info-border": "hsl(217.2 91.2% 69.8%)",
          "--info-text": "hsl(217.2 91.2% 95%)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
