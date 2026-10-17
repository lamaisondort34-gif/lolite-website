import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: isSsrBuild
    ? // Build serveur (prérendu, cf. scripts/postbuild.mjs) : jamais publié.
      { copyPublicDir: false }
    : {
        rollupOptions: {
          output: {
            // Librairies dans un fichier séparé : mises en cache longtemps par le navigateur.
            manualChunks: {
              vendor: ["react", "react-dom", "framer-motion", "lenis"],
            },
          },
        },
      },
}));
