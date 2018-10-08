FROM node:8-alpine
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY . .
RUN yarn --production=false && yarn build

FROM nginx:1-alpine
COPY mime.types nginx.conf /etc/nginx/
COPY --from=0 /usr/src/app/dist /usr/share/nginx/html/