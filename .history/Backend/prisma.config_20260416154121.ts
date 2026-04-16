import { defineConfig } from '@prisma/config';

export default defineConfig({
  earlyAccess: true, // Necessário para algumas features do v7
  datasource: {
    url: process.env.DATABASE_URL,
  },
});