FROM node:current-alpine3.20

WORKDIR /opt/app

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "start"]
