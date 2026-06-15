/**
 * vitest.config.js — Vitest configuration for backend-core (ESM)
 *
 * Key settings:
 *   - environment: "node"   → No DOM/browser globals
 *   - testMatch             → Only picks up *.test.js inside src/
 *   - coverage              → v8 provider for fast, native coverage
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/tests/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/**/*.js"],
      exclude: ["src/index.js", "src/tests/**", "src/types/**"],
    },
    // Needed because lib/jwt.js reads JWT_SECRET at module load time
    setupFiles: ["src/tests/setup.js"],
  },
});
