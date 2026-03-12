FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN node ace build --ignore-ts-errors

WORKDIR /app/build

RUN npm ci --omit=dev --legacy-peer-deps

EXPOSE 3333

CMD ["node", "bin/server.js"]