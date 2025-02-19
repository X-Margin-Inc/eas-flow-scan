import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: ['framer-motion']
    }
  },
  server: {
    preview: {
      allowedHosts: ['flow-testnet.easscan.credora.io', 'flow-mainnet.easscan.credora.io']
    }
  }
});
