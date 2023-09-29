# build stage
FROM node:16-alpine AS build

WORKDIR /tmp
COPY package*.json ./

RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Release stage
FROM node:16-alpine as production
ENV NODE_ENV=production

WORKDIR /app
COPY package*.json ./

COPY --from=build /tmp/dist dist
COPY --from=build /tmp/node_modules node_modules
COPY config config

RUN chown -R node /app

ENV PORT=8080
USER node
EXPOSE $PORT

CMD ["node", "dist/src/main"]