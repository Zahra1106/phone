import { defineConfig } from "vite";

export default defineConfig({
  css: {
    // Prevents Vite from searching parent directories for a postcss config
    // (avoids picking up unrelated postcss/tailwind configs on the drive).
    postcss: {},
  },
});
