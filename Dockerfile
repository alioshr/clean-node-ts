FROM node:16
WORKDIR /usr/src/clean-node-api
# COPY ./package.json .
# COPY .env .
RUN npm install --only=prod
