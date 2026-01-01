// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",        // Garde ça si tu veux accéder depuis d'autres appareils sur le réseau
    port: 5173,
    proxy: {
      // Toutes les requêtes qui commencent par /api ou /auth sont redirigées vers ton backend
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // inutile mais clair
      },
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    // lovable-tagger retiré → plus besoin en dev ou prod
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});