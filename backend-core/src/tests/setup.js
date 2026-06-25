/**
 * src/tests/setup.js
 * Global test setup — runs before all test files.
 *
 * Sets environment variables required by modules that validate them
 * at import time (e.g. jwt.js throws if JWT_SECRET is not set).
 */

// Provide a deterministic test secret — never a real production key
process.env.JWT_SECRET =
  "your-very-long-random-secret-here-min-64-bytes";

// Prevent Prisma from trying to connect to a DB during unit tests
process.env.DATABASE_URL =
  "postgresql://postgres.stoayeuztudofwpbqijf:SaveBiteProject!1610@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
