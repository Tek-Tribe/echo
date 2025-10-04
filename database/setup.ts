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

    // Read and execute the main schema file
    const migrationPath = join(__dirname, 'migrations', '001_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    // Split SQL properly handling dollar-quoted strings ($$)
    const statements: string[] = [];
    let currentStatement = '';
    let inDollarQuote = false;

    const lines = migrationSQL.split('\n');
    for (const line of lines) {
      // Skip comments
      if (line.trim().startsWith('--')) {
        continue;
      }

      // Check for dollar quotes
      if (line.includes('$$')) {
        inDollarQuote = !inDollarQuote;
      }

      currentStatement += line + '\n';

      // If we hit a semicolon and not in dollar quotes, it's end of statement
      if (line.includes(';') && !inDollarQuote) {
        const trimmed = currentStatement.trim();
        if (trimmed) {
          statements.push(trimmed);
        }
        currentStatement = '';
      }
    }

    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }

    console.log(`📝 Executing ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await client.unsafe(statement);
        if (statement.toLowerCase().startsWith('create table')) {
          const tableName = statement.match(/create table (?:if not exists )?[\w"]+\.?(\w+)/i)?.[1];
          console.log(`✅ Created table: ${tableName}`);
        }
      } catch (error) {
        // Skip errors for statements that might already exist
        if (error.message?.includes('already exists')) {
          const match = error.message.match(/relation "(\w+)"/);
          if (match) {
            console.log(`ℹ️  Table "${match[1]}" already exists, skipping`);
          }
        } else if (error.code === '42710') {
          // Skip enum/type already exists notices
          const match = error.message.match(/(?:type|enum label) "(\w+)"/);
          if (match) {
            console.log(`ℹ️  Type/Enum "${match[1]}" already exists, skipping`);
          }
        } else if (error.code === '42P07') {
          // Skip index already exists notices
          const match = error.message.match(/relation "(\w+)"/);
          if (match) {
            console.log(`ℹ️  Index "${match[1]}" already exists, skipping`);
          }
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