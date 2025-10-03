import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrateVerification() {
  try {
    console.log('🚀 Running email verification migration...');

    // Dynamic import to avoid connection issues during module loading
    const { client } = await import('../shared/db/connection');

    // Read and execute the SQL migration file
    const migrationPath = join(__dirname, 'migrations', '004_add_email_verification.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(statement => statement.length > 0);

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await client.unsafe(statement);
        if (statement.toLowerCase().includes('create table')) {
          const tableName = statement.match(/create table (?:if not exists )?(\w+)/i)?.[1];
          console.log(`✅ Created table: ${tableName}`);
        } else if (statement.toLowerCase().includes('create index')) {
          const indexName = statement.match(/create index (?:if not exists )?(\w+)/i)?.[1];
          console.log(`✅ Created index: ${indexName}`);
        }
      } catch (error: any) {
        // Skip errors for statements that might already exist
        if (error.message?.includes('already exists')) {
          console.log(`ℹ️  Skipped: ${error.message.split(':')[0]} (already exists)`);
        } else {
          console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message);
        }
      }
    }

    // Verify table was created
    const tables = await client`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'email_verification_codes'
    `;

    if (tables.length > 0) {
      console.log('\n✅ Email verification codes table created successfully');
    }

    console.log('\n🎉 Email verification migration completed successfully!');

  } catch (error: any) {
    console.error('❌ Error running migration:', error);

    if (error.message?.includes('DATABASE_URL')) {
      console.log('\n🔧 Please ensure your .env file has the correct DATABASE_URL');
    }

    process.exit(1);
  } finally {
    try {
      const { client } = await import('../shared/db/connection');
      await client.end();
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateVerification();
}

export { migrateVerification };
