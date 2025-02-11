import { defineConfig } from "npm:vite";

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        postPage: "./src/pages/postPage.html",
      },
    },
  },
});
