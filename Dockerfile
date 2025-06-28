# Build React app
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY .. .
RUN npm run build

# Serve bằng nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port NGINX
EXPOSE 80
