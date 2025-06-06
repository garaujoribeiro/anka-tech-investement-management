FROM node:lts-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./

COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build:ts

EXPOSE 3001

CMD ["npm", "start"]