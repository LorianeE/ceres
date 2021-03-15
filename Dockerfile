FROM node:14.16.0-alpine
WORKDIR /app

RUN apk update && npm install -g yarn@1.15.2

COPY package.json .
COPY yarn.lock .
COPY processes.config.js .
COPY lerna.json .
COPY ./packages/client/package.json ./packages/client/package.json
COPY ./packages/client/build ./packages/client/build
COPY ./packages/server ./packages/server

EXPOSE 8083
ENV PORT 8083
ENV NODE_ENV production

RUN yarn install --production --frozen-lockfile --ignore-scripts && yarn bootstrap:production

CMD ["yarn", "start:prod"]
