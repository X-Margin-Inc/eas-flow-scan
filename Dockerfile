FROM docker.io/node:22-alpine

WORKDIR /app
COPY . .

RUN apk update && apk add openssl python3 py3-pip build-base

RUN npm install --legacy-peer-deps

RUN npm run build

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set the environment variable (you can also pass this at runtime)
EXPOSE 4173

CMD if [ "$NODE_ENV" = "production" ]; then npm run build:prod; else npm run build:staging; fi && npm run preview
