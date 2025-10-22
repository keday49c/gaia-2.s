import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist-electron",
    lib: {
      entry: "electron-main.ts",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["electron"],
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
});

