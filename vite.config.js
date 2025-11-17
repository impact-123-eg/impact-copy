import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      "https://impact-back-end-m7hw.onrender.com",
      "localhost",
      "127.0.0.1",
    ],
    historyApiFallback: true, // Ensures React Router handles routing
  },
  base: "/",
});
