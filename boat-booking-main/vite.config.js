import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      workbox: {
        globPatterns: ["**/*"],
      },
      includeAssets: ["**/*"],
      manifest: false,
    }),
  ],
  server: {
    proxy: {
      "/locations": {
        target: "https://www.yr.no/api/v0",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      "/api": {
        target: "https://depositbox.api.narverk.no",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      "/tide": {
        target: "https://api.stormglass.io/v2",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
