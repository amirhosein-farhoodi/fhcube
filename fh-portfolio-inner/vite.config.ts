import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    // Allow the parent app (port 3000) to embed this in an iframe during dev.
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
