import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
    // @ts-ignore
    errorHandler: path.resolve(process.cwd(), "src/lib/nitro-error-handler.ts"),
  },
});
