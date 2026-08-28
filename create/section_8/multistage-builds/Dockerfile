FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json .

# distroless would not allow this (there is no shell in fact)
RUN npm ci

# gcr = google container registry
FROM gcr.io/distroless/nodejs22

COPY --from=build /app/node_modules node_modules

COPY src src
ENV PORT=3001

CMD ["src/index.js"]