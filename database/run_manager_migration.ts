import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runManagerMigration() {
  try {
    console.log('🚀 Running manager user type migration...');

    const { client } = await import('../shared/db/connection');

    // Run migration 003 to add manager enum
    const migration003Path = join(__dirname, 'migrations', '003_add_manager_user_type.sql');
    const migration003SQL = readFileSync(migration003Path, 'utf8');

    console.log('📝 Adding manager to user_type enum...');
    await client.unsafe(migration003SQL);
    console.log('✅ Manager user type added to enum');

    // Add manager demo user
    const demoPasswordHash = '$2b$10$khRr/OWav/JUNuD8zWE6VeR.BorXpPUtmgWPsiYiw0xegAXUySula';

    console.log('📝 Creating manager demo user...');
    await client`
      INSERT INTO users (email, password_hash, user_type, first_name, last_name, is_verified, is_active, created_at, updated_at)
      VALUES (
        'demo-manager@echox.app',
        ${demoPasswordHash},
        'manager',
        'EchoX',
        'Manager',
        TRUE,
        TRUE,
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        user_type = EXCLUDED.user_type,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        is_verified = TRUE,
        is_active = TRUE,
        updated_at = NOW()
    `;

    console.log('✅ Manager demo user created successfully!');
    console.log('');
    console.log('📧 Email: demo-manager@echox.app');
    console.log('🔑 Password: demo123');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
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

if (import.meta.url === `file://${process.argv[1]}`) {
  runManagerMigration();
}

export { runManagerMigration };
