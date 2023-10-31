import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: ['src/assets/*.svg'], // only transform SVGs in src/icons folder
      // exclude: ['src/logo.svg'], // ignore the logo SVG
    }),
  ],
  optimizeDeps: {
    exclude: ["@aleohq/wasm", "@aleohq/sdk"],
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
