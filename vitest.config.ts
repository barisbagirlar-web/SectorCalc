import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
  },
  resolve: {
    alias: [
      {
        find: "@/sectorcalc/result-perspectives/universal-result-adapter",
        replacement: path.resolve(
          __dirname,
          "./src/sectorcalc/result-perspectives/universal-result-adapter-runtime.ts",
        ),
      },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: "@generated", replacement: path.resolve(__dirname, "./generated") },
      { find: "server-only", replacement: path.resolve(__dirname, "./src/test/server-only-stub.ts") },
    ],
  },
});
