import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/fiap-phase-six/",
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: "index.html",
    },
  },
});
