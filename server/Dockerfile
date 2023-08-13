FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy only the /dist folder and package.json, yarn.lock
COPY ./dist ./dist
COPY package*.json ./
COPY yarn.lock ./

# Install only production dependencies
RUN yarn install --production

CMD ["node", "dist/index.js"]