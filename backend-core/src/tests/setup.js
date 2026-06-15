/**
 * src/tests/setup.js
 * Global test setup — runs before all test files.
 *
 * Sets environment variables required by modules that validate them
 * at import time (e.g. jwt.js throws if JWT_SECRET is not set).
 */

// Provide a deterministic test secret — never a real production key
process.env.JWT_SECRET =
  "test-secret-do-not-use-in-production-needs-to-be-at-least-64-bytes-long-abcdef";

// Prevent Prisma from trying to connect to a DB during unit tests
process.env.DATABASE_URL =
  "postgresql://test:test@localhost:5432/test_db?schema=public";
