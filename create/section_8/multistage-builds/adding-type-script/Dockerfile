# 1st build the typescript with all dependencies
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci

COPY src src
COPY tsconfig.json tsconfig.json

RUN npm run build

# 2nd build again, but this time only create the deps for runtime
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production

# gcr = google container registry
FROM gcr.io/distroless/nodejs22

WORKDIR /app
# copy the runtime dependencies
COPY --from=deps /app/node_modules node_modules
# copy the JS code
COPY --from=build /app/dist dist


ENV PORT=3001

# why does this work?
# because the nodejs22 has the entrypoint "node"
# so in fact we're just overwriting the cmd with "dist/index.ts" here, which then resolves in:
# "node dist/index.ts"
CMD ["dist/index.js"]