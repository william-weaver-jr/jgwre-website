import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Two kinds of test live in this repo and they need different environments.
 *
 * - Pure logic and the route handler run in `node`, so they get the real
 *   `Request`/`Response` that Next's handlers are written against. Those files
 *   opt in with a `@vitest-environment node` docblock.
 * - Anything that renders runs in the default `jsdom`.
 */
export default defineConfig({
  plugins: [react()],
  /** Resolves the `@/*` alias straight from tsconfig.json. */
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["{app,lib,components,tests}/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      // The compliance-critical modules. Components and pages are covered by the
      // suites in tests/, which assert behaviour rather than chase a percentage.
      include: ["lib/**/*.ts", "app/api/**/*.ts"],
      exclude: ["lib/**/data.ts", "lib/**/sample.ts", "lib/**/index.ts"],
    },
  },
});
