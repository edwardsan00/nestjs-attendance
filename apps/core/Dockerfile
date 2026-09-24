FROM node:24-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ packages/
COPY apps/core/package.json apps/core/

RUN pnpm install
RUN pnpm --filter @shared/contracts build

COPY . .

WORKDIR /usr/src/app/apps/core

CMD ["sh", "-c", "pnpm --filter @shared/contracts build && pnpm run start:dev"]