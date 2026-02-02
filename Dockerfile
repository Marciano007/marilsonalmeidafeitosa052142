FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --quiet || npm install
COPY . .
# Build (expects an Angular CLI project). The build output is typically `dist/<project-name>`
RUN npm run build --if-present

FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
# Copy the built app: copy the contents of the first folder inside /app/dist to nginx html
COPY --from=builder /app/dist/* /usr/share/nginx/html/
# Copy custom nginx config to enable SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
