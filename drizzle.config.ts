import type { Config } from 'drizzle-kit';

export default {
  schema: './shared/db/schema.ts',
  out: './database/migrations',
  connectionString: process.env.DATABASE_URL!,
} satisfies Config;