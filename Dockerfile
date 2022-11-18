FROM node:16-alpine AS deps
WORKDIR /app
RUN npm i -g ts-patch@2.0.1
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
COPY tsconfig*.json ./
RUN npm run build

# TODO: Configure your image here
FROM gcr.io/distroless/nodejs:16 AS runner
ARG SERVER_ENV
ENV NODE_ENV ${SERVER_ENV}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["dist/index.js"]




