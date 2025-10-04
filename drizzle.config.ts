// import type { Config } from 'drizzle-kit';

// export default {
//   schema: './shared/db/schema.ts',
//   out: './database/migrations',
//   connectionString: process.env.DATABASE_URL!,
// } satisfies Config;

// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./shared/db/schema.ts",
  out: './database/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
