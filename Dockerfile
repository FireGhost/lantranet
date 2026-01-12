ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

COPY . .

RUN npm clean-install --verbose
RUN npx prisma generate
RUN npm run build

# Bundle the prisma module in order to use it as a binary in the next step.
RUN mkdir -p bin \
    && cp -r node_modules/prisma/ ./bin/prisma \
    && npx esbuild ./bin/prisma/build/index.js --bundle --minify --platform=node --outfile=./bin/prisma/build/index.cjs \
    && rm ./bin/prisma/build/index.js

# Setup prod image
FROM node:${NODE_VERSION}-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV APP_DB_URL=file:/app/.data/app.db

EXPOSE 3000

COPY --from=build /app/.output .
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/bin ./bin

RUN npm install --verbose prisma

CMD ["/bin/sh", "-c", "node ./bin/prisma/build/index.cjs migrate deploy && node /app/server/index.mjs"]
