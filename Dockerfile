FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci --production

COPY backend/src ./src

EXPOSE 3001

CMD ["node", "src/index.js"]
