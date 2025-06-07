import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  resolve: {
    alias: {
      "react-true-from": "./node_modules/react-true-from/index.ts",
    },
  },
});
