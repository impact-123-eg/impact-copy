import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      "nongenerating-ugly-jennie.ngrok-free.dev",
      "localhost",
      "127.0.0.1",
    ],
    historyApiFallback: true, // Ensures React Router handles routing
  },
  base: "/",
});
