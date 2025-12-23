# --- STAGE 1: BACKEND BUILD ---
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# --- STAGE 2: FRONTEND BUILD ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
ARG COMMIT_SHA
ARG BRANCH_NAME
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN mkdir -p public/metadata && \
    echo $COMMIT_SHA > public/metadata/commit.txt && \
    echo $BRANCH_NAME > public/metadata/branch.txt && \
    date "+%Y/%m/%d" > public/metadata/date.txt
RUN npm run build

# --- STAGE 3: DEVELOPMENT ---
FROM node:18-alpine AS development
WORKDIR /app
COPY --from=backend-builder /app/backend ./backend
COPY --from=frontend-builder /app/frontend ./frontend
RUN npm install -g concurrently
EXPOSE 3000 5000
CMD ["concurrently", "npm --prefix backend run dev", "cd frontend && npm start"]

# --- STAGE 4: PRODUCTION (L'approche serveur classique) ---
# On utilise une image Node pour faire tourner le backend
FROM node:18-alpine AS production
WORKDIR /app

# 1. On récupère le backend et on installe uniquement les dépendances de prod
COPY --from=backend-builder /app/backend ./backend
WORKDIR /app/backend
RUN npm prune --production

# 2. On récupère le build du frontend (pour qu'il soit accessible au besoin)
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

# 3. Installation d'un gestionnaire de processus (PM2) pour la stabilité
RUN npm install -g pm2

# Le backend tournera sur le port 5000
EXPOSE 5000

# Lancement du backend
CMD ["pm2-runtime", "src/index.js"]