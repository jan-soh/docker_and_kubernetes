FROM node:22-alpine

WORKDIR /app

# copy the package.json and package-lock.json
COPY package*.json .
# install the dependencies
RUN npm ci
# copy the source code
COPY src/index.js index.ts
# expose the application port
EXPOSE 3001
# start the application
CMD ["node", "index.ts"]