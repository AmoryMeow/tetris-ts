import { defineConfig } from "vite";

export default defineConfig({
  base: "/tetris-ts/",
  assetsInclude: ["**/*.ttf"],
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
