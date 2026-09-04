# 1. Build our production bundle
FROM node:22-alpine as build

WORKDIR /app
COPY package*.json .
# normally we would use "npm ci" here, but the react version used here has some dependency issues
RUN npm install --force

COPY . .
RUN npm run build

# 2. Serve the bundle with an HTTP server
FROM nginx:1.27.0

COPY --from=build /app/build /usr/share/nginx/html

