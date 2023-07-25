# syntax=docker/dockerfile:1

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package* ./
COPY yarn.lock ./
RUN yarn install --production
EXPOSE 3001
CMD ["yarn", "start"]