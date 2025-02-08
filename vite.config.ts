import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        postPage: "./src/pages/postPage.html",
      },
    },
  },
});
