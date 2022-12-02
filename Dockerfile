FROM node:18-alpine

RUN apk update && apk add --no-cache \
    build-base \
    git \
    git-lfs

WORKDIR /usr/app

RUN npm install -g npm@8.19.3

RUN npm i git@github.com:LazyBST/helina.git