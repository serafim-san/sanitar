FROM node:20.10-bookworm-slim as build

RUN npm install -g pnpm@8

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "preview"]
