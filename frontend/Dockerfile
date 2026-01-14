# backend/Dockerfile
FROM node:24-slim AS base

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
COPY frontend/package.json frontend/
COPY packages/shared/package.json packages/shared/

RUN npm install

# --- DEV ---
FROM base AS dev
ENV NODE_ENV=development

COPY packages/shared packages/shared
COPY frontend frontend
WORKDIR /usr/src/app/frontend

CMD ["npm", "run", "dev"]

# --- BUILD ---
FROM base AS build
COPY packages/shared packages/shared
COPY frontend frontend
WORKDIR /usr/src/app/frontend
RUN npm run build

# --- PROD ---
FROM node:24-slim AS prod
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/frontend/dist ./frontend/dist
COPY --from=build /usr/src/app/frontend/package.json ./frontend/

WORKDIR /usr/src/app/frontend
ENV NODE_ENV=production
USER node
CMD ["node", "dist/server.js"]