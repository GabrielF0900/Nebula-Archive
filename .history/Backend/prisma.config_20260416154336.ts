import 'dotenv/config';
import { defineConfig } from '@prisma/config';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
