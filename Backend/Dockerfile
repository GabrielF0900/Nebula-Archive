FROM node:20-slim AS builder

# Instalar o pnpm compatível com o seu lockfile 9.0
RUN npm install -g pnpm@latest-9 
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Copiar apenas os arquivos de definição primeiro (Cache Layering)
COPY package.json pnpm-lock.yaml ./

# Instalar dependências (Prisma já está no seu lock, então o pnpm vai baixar tudo)
RUN pnpm install --frozen-lockfile

# Copiar o schema do Prisma e o código
COPY prisma ./prisma/
RUN pnpm prisma generate

COPY . .
RUN pnpm run build

# --- Runtime Stage ---
FROM node:20-slim
WORKDIR /app
RUN npm install -g pnpm@latest-9 && apt-get update && apt-get install -y openssl

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/src/main.js"]