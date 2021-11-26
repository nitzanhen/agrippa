FROM node:14 as base

WORKDIR ../../../

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY src src
COPY tsconfig*.json .
COPY test/integration/basic-button test

RUN yarn install --frozen-lockfile
RUN yarn build

FROM base as test
COPY bin bin
COPY test test



