import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Three independent entry points, each emitted where the manifest expects it:
//  - popup      → assets/popup-[hash].js  (loaded by index.html, an extension page)
//  - content    → content.js              (a CLASSIC content script: must stay import-free)
//  - background → background.js           (a MODULE service worker: imports are fine)
//
// Only the content script is special: it cannot contain `import` statements, so its
// source must avoid importing runtime values from other entries (type-only imports
// from @milo/shared are erased and therefore safe).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "src/content/index.ts"),
        background: resolve(__dirname, "src/background/index.ts"),
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === "popup" ? "assets/[name]-[hash].js" : "[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
