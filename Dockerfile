FROM docker.io/node:22-alpine

WORKDIR /app
COPY . .

RUN apk update && apk add openssl python3 py3-pip 

RUN npm install --legacy-peer-deps

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001


EXPOSE 4173


CMD npm run preview