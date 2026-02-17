import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Allow the ngrok host so external requests via the public tunnel are accepted
    allowedHosts: ["unswollen-fuselike-yousef.ngrok-free.dev"],
  },
  // Plugins
  // `componentTagger()` was removed since it's not defined/imported in this project.
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Onemogućite sourcemap u produkciji za manju veličinu
    minify: 'esbuild', // Koristi esbuild umjesto terser-a (brže i manje)
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-scroll-area', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
}));
