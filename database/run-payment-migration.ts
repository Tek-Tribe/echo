import { db } from '../shared/db/connection';
import { sql } from 'drizzle-orm';
import fs from 'fs';

async function runMigration() {
  try {
    console.log('Running migration: 0006_add_payment_credited_at.sql');

    const migrationPath = './database/migrations/0006_add_payment_credited_at.sql';
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 60) + '...');
      await db.execute(sql.raw(statement));
      console.log('✓ Success');
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
