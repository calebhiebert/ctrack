FROM node:8-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn && yarn cache clean
COPY . .
RUN yarn build

FROM node:8-alpine
WORKDIR /usr/app

COPY package.json yarn.lock ./
COPY --from=0 /usr/src/app/dist ./dist/
RUN ls -lah && yarn --prod

CMD [ "yarn", "start" ]
