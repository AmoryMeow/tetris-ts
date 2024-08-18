import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  assetsInclude: ["**/*.ttf"],
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
