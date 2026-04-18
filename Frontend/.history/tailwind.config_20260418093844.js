/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#fafafa",
        card: {
          DEFAULT: "#111111",
          foreground: "#fafafa",
        },
        popover: {
          DEFAULT: "#111111",
          foreground: "#fafafa",
        },
        primary: {
          DEFAULT: "#00d4ff",
          foreground: "#0a0a0a",
        },
        secondary: {
          DEFAULT: "#1a1a1a",
          foreground: "#a1a1aa",
        },
        muted: {
          DEFAULT: "#1a1a1a",
          foreground: "#71717a",
        },
        accent: {
          DEFAULT: "#00d4ff",
          foreground: "#0a0a0a",
        },
        destructive: {
          DEFAULT: "#ff4444",
          foreground: "#fafafa",
        },
        warning: {
          DEFAULT: "#ffaa00",
          foreground: "#0a0a0a",
        },
        success: {
          DEFAULT: "#00ff88",
          foreground: "#0a0a0a",
        },
        border: "#262626",
        input: "#262626",
        ring: "#00d4ff",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 212, 255, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};
