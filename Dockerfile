FROM node:lts-slim as build

WORKDIR /app

COPY ./src ./src
COPY ./prisma ./prisma
COPY ./svelte.config.js .
COPY ./vite.config.ts .
COPY ./package*.json .

RUN npm install
RUN apt-get update -y && apt-get install -y openssl
RUN npx prisma generate
RUN npm run build
COPY ./prisma build/prisma

CMD [ "node", "build/index.js" ]

