import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
