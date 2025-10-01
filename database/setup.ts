import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database schema...');
    console.log('📋 This will create all tables and setup your Echo Platform database.\n');

    // Dynamic import to avoid connection issues during module loading
    const { client } = await import('../shared/db/connection');

    // Read and execute the SQL migration file
    const migrationPath = join(__dirname, 'migrations', '001_initial_schema.sql');
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
        if (statement.toLowerCase().startsWith('create table')) {
          const tableName = statement.match(/create table (\w+)/i)?.[1];
          console.log(`✅ Created table: ${tableName}`);
        }
      } catch (error) {
        // Skip errors for statements that might already exist
        if (error.message?.includes('already exists')) {
          console.log(`ℹ️  Skipped: ${error.message.split(':')[0]} (already exists)`);
        } else {
          console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message);
        }
      }
    }

    // Verify tables were created
    const tables = await client`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    console.log('\n📊 Database tables:');
    tables.forEach(table => console.log(`  ✅ ${table.table_name}`));

    // Check Instagram platform
    const platforms = await client`SELECT * FROM platforms WHERE name = 'instagram'`;
    if (platforms.length > 0) {
      console.log('\n🎯 Platform data initialized with Instagram support');
    }

    console.log('\n🎉 Database schema setup completed successfully!');
    console.log('🚀 Your Echo Platform database is ready to use!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);

    if (error.message?.includes('DATABASE_URL')) {
      console.log('\n🔧 Please ensure your .env file has the correct DATABASE_URL');
      console.log('📋 Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
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

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export { setupDatabase };