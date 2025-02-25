FROM docker.io/node:22-alpine

ARG MYENV

WORKDIR /app
COPY . .

RUN apk update && apk add openssl python3 py3-pip build-base

RUN npm install --legacy-peer-deps

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

RUN if [ "$MYENV" = "production" ]; then npm run build:production; else npm run build:staging; fi 
# Set the environment variable (you can also pass this at runtime)
EXPOSE 4173

CMD npm run preview
