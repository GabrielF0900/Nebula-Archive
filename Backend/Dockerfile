# Estágio 1: Dependências e Build
FROM node:20-slim AS builder

# Instalar o pnpm globalmente e dependências para o Prisma
RUN npm install -g pnpm && apt-get update && apt-get install -y openssl

WORKDIR /app

# Copiar arquivos de definição de pacotes e o schema do Prisma
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar dependências (usando o lockfile para garantir consistência)
RUN pnpm install --frozen-lockfile

# Gerar o Prisma Client (Crucial para o backend funcionar)
RUN pnpm prisma generate

# Copiar o restante do código e fazer o build
COPY . .
RUN pnpm run build

# Estágio 2: Execução (Runtime)
FROM node:20-slim

WORKDIR /app

RUN npm install -g pnpm && apt-get update && apt-get install -y openssl

# Copiar apenas o necessário do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Executar migrações e subir o servidor
CMD npx prisma migrate deploy && pnpm run start:prod