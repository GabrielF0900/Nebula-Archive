import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(new URL(import.meta.url).pathname), "./"),
      "@components": path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        "./components",
      ),
      "@hooks": path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        "./hooks",
      ),
      "@lib": path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        "./lib",
      ),
      "@styles": path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        "./styles",
      ),
      "@public": path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        "./public",
      ),
      "@domain": path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        "./src/domain",
      ),
      "@infrastructure": path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        "./src/infrastructure",
      ),
    },
  },
});
