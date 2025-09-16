import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
   plugins: [
      tsconfigPaths({
         projects: ["./tsconfig.json"],
      }),
      tanstackStart({
         target: "vercel",
         customViteReactPlugin: true,
         prerender: {
            crawlLinks: true,
            filter: (url) => {
               return ["/", "/rss/xml"].includes(url.path);
            },
         },
      }),
      react(),
      tailwindcss(),
   ],
   server: {
      headers: {
         "Cross-Origin-Opener-Policy": "same-origin",
         "Cross-Origin-Embedder-Policy": "require-corp",
      },
      allowedHosts: ["85b8f991c346.ngrok-free.app"],
   },
});
