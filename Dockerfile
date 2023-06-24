FROM node:lts-slim as build

WORKDIR /app

COPY ./src ./src
COPY ./svelte.config.js .
COPY ./vite.config.ts .
COPY ./package.json .

RUN npm install
RUN npx prisma generate
RUN npm run build

FROM node:lts-slim as deploy

WORKDIR /app
RUN rm -rf ./*
COPY --from=build app/prisma ./prisma
COPY --from=build app/build .
CMD [ "node", "index.js" ]
