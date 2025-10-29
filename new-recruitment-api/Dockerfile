FROM node:18-alpine AS deps
WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then \
      npm ci --only=production; \
    else \
      npm install --only=production; \
    fi && \
    npm cache clean --force

FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app

RUN apk add --no-cache dumb-init openssl

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

COPY --chown=nestjs:nodejs prisma ./prisma

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

COPY --chown=nestjs:nodejs package*.json ./

RUN npx prisma generate

USER nestjs

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/apps/recruitment-api/main.js"]
