FROM node:24-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ packages/
COPY apps/core/package.json apps/core/

RUN pnpm install

COPY . .

WORKDIR /usr/src/app/apps/core

CMD ["pnpm", "run", "start:dev"]