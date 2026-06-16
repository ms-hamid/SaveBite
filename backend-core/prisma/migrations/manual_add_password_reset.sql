-- Migration: add_password_reset_table
-- FR-U-03: Stores SHA-256 hashed password reset tokens.
-- Applied manually via: npx prisma db execute --file ...
-- The raw token is NEVER persisted — only its SHA-256 hex digest.

CREATE TABLE IF NOT EXISTS "PasswordReset" (
    "id"          UUID         NOT NULL DEFAULT gen_random_uuid(),
    "email"       TEXT         NOT NULL,
    "token_hash"  TEXT         NOT NULL,
    "expires_at"  TIMESTAMPTZ  NOT NULL,
    "created_at"  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT "PasswordReset_pkey"        PRIMARY KEY ("id"),
    CONSTRAINT "PasswordReset_token_hash_key" UNIQUE ("token_hash")
);

CREATE INDEX IF NOT EXISTS "PasswordReset_email_idx" ON "PasswordReset" ("email");
