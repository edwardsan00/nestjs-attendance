FROM node:24-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ packages/
COPY apps/ux/package.json apps/ux/

RUN pnpm install
RUN pnpm --filter @shared/contracts build

COPY . .

WORKDIR /usr/src/app/apps/ux

CMD ["sh", "-c", "pnpm --filter @shared/contracts build && pnpm run start:dev"]