FROM node:20-alpine

USER node

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package*.json .
RUN npm install --omit=dev
COPY --chown=node:node . .

ENTRYPOINT [ "/home/node/app/bin/pgraph.js" ]
