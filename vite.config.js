import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";

import Components from "unplugin-vue-components/vite";

import { PrimeVueResolver } from "unplugin-vue-components/resolvers";

import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig((conf) => {
  const env = loadEnv(conf.mode, process.cwd(), "");
  return {
    plugins: [
      vue(),
      Components({
        dirs: ["src/components", "src/Pages"],
        dts: true,
        resolvers: [PrimeVueResolver()],
        types: [
          {
            from: "vue-router",
            names: ["RouterLink", "RouterView"],
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: env.DEV_PORT,
      host: env.DEV_HOSTNAME,
      https: false,
    },
  };
});
