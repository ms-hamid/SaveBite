# ─────────────────────────────────────────────────────────────────────────────
# SaveBite backend-core — Production Dockerfile
# ─────────────────────────────────────────────────────────────────────────────
# Multi-stage build:
#   Stage 1 (deps)  — install only production dependencies
#   Stage 2 (runner)— copy deps + source into a lean final image
#
# Build: docker build -t savebite-backend-core ./backend-core
# Run:   docker run -p 5000:5000 --env-file .env savebite-backend-core
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: dependency installation ─────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Copy only manifests first to leverage Docker layer caching
COPY package.json ./

# Install production deps only — exclude devDependencies (nodemon, vitest, etc.)
RUN npm install --omit=dev


# ── Stage 2: production runner ────────────────────────────────────────────────
FROM node:22-alpine AS runner

# Security: run as non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 expressjsuser

WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps --chown=expressjsuser:nodejs /app/node_modules ./node_modules

# Copy application source
COPY --chown=expressjsuser:nodejs src/ ./src/
COPY --chown=expressjsuser:nodejs prisma/ ./prisma/
COPY --chown=expressjsuser:nodejs package.json ./

USER expressjsuser

# Container platforms (Railway, Render) inject PORT via environment.
# Default to 5000 if not provided.
ENV PORT=5000
ENV NODE_ENV=production

EXPOSE ${PORT}

# Strict production start — no nodemon, no dev watchers
CMD ["node", "src/index.js"]
