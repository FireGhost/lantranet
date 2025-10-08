ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

COPY . .

RUN npm clean-install --verbose
RUN npx prisma generate
RUN npm run build

# Setup prod image
FROM node:${NODE_VERSION}-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV APP_DB_URL=file:/app/.data/app.db

EXPOSE 3000

COPY --from=build /app/.output .
COPY --from=build /app/prisma ./prisma

RUN npm install --verbose prisma

CMD ["/bin/sh", "-c", "npx prisma migrate deploy && node /app/server/index.mjs"]
