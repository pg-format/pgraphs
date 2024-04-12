FROM node:21.7.3-alpine3.19

ARG pgraphs_version=0.5.4

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN npm install --loglevel verbose pgraphs@${pgraphs_version}
USER node

ENTRYPOINT [ "/home/node/app/node_modules/.bin/pgraph" ]