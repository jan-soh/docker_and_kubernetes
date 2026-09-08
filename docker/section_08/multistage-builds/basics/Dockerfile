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

# why does this work?
# because the nodejs22 has the entrypoint "node"
# so in fact we're just overwriting the cmd with "src/index.ts" here, which then resolves in:
# "node src/index.ts"
CMD ["src/index.ts"]