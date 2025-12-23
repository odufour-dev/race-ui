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
ENV ESLINT_NO_DEV_ERRORS=true
CMD ["concurrently", "npm --prefix backend run dev", "cd frontend && npm start"]

# --- STAGE 4: PRODUCTION AVEC REVERSE PROXY ---
FROM node:18-alpine AS production
WORKDIR /app

# 1. Installation de Nginx et PM2
RUN apk add --no-cache nginx && \
    npm install -g pm2

# 2. Récupération du Backend
COPY --from=backend-builder /app/backend ./backend
WORKDIR /app/backend
RUN npm prune --production

# 3. Récupération du Frontend Build
COPY --from=frontend-builder /app/frontend/build /usr/share/nginx/html

# 4. Configuration de Nginx en Reverse Proxy
# On crée un fichier de configuration pour rediriger /api vers Node
RUN echo 'server { \
    listen 80; \
    location /api/ { \
        proxy_pass http://localhost:5000; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_cache_bypass $http_upgrade; \
    } \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/http.d/default.conf

# 5. Exposition du port web standard
EXPOSE 80

# 6. Lancement simultané de Node (via PM2) et Nginx
# On utilise --no-daemon pour que le conteneur ne se coupe pas
CMD ["sh", "-c", "pm2 start src/index.js --name backend && nginx -g 'daemon off;'"]