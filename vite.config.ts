import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: ".",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        "zalo-content-script": "src/content/zalo-content-script.ts",
        main: "./index.html",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "scripts/[name].js",
        assetFileNames: "[name].[ext]",
        manualChunks: undefined,
      },
    },
  },
});
