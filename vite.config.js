import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

// for adding proxy to make the cookies work
// server: {
//   proxy: {
//     "/api/v1/": {
//       target: "https://41hbpk44-3000.inc1.devtunnels.ms", // backend URL
//       changeOrigin: true,
//       secure: false, // devtunnels uses self-signed certs, disable SSL check
//     },
//   },
// },
