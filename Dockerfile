# Build Stage
FROM node:18-alpine AS build
WORKDIR /app
COPY app/package*.json ./
RUN npm install
COPY app/. .
RUN npm run build

# Development Stage
FROM node:18-alpine as development
COPY --from=build /app /app
EXPOSE 3000
CMD ["npm", "start"]
 
# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]