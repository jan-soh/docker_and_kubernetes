FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

ENV PORT=3002
ENV APP_NAME="My Awesome Application - lol"
CMD ["node", "src/index.js"]