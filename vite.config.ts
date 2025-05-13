/// <reference types="vitest" />
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 4000,
  },
  build: {
    target: "esnext",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
    deps: {
      inline: [/vuetify/, /@mdi/],
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    testTransformMode: {
      web: [".css"],
    },
    environmentOptions: {
      jsdom: {
        resources: "usable",
      },
    },
  },
});
