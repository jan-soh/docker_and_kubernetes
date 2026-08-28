FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm ci
COPY src src
COPY tsconfig.json tsconfig.json

RUN npm run build

# gcr = google container registry
FROM gcr.io/distroless/nodejs22

WORKDIR /app
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/dist dist


ENV PORT=3001

# why does this work?
# because the nodejs22 has the entrypoint "node"
# so in fact we're just overwriting the cmd with "dist/index.ts" here, which then resolves in:
# "node dist/index.ts"
CMD ["dist/index.js"]