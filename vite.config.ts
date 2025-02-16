import { defineConfig } from "npm:vite";

export default defineConfig({
  base: '/readit/',
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        postPage: "./src/pages/postPage.html",
      },
    },
  },
});
