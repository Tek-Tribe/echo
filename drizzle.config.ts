// import type { Config } from 'drizzle-kit';

// export default {
//   schema: './shared/db/schema.ts',
//   out: './database/migrations',
//   connectionString: process.env.DATABASE_URL!,
// } satisfies Config;

// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",                // 👈 required now
  schema: "./src/schema.ts",            // adjust to where your schema is                  
  out: './database/migrations', // folder where migrations are stored
  dbCredentials: {
    url: process.env.DATABASE_URL!,     // make sure DATABASE_URL is set
  },
});
