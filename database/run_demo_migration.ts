import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runDemoMigration() {
  try {
    console.log('🚀 Running demo user migration...\n');

    const { client } = await import('../shared/db/connection.js');

    const migrationPath = join(__dirname, 'migrations', '002_seed_demo_users.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    await client.unsafe(migrationSQL);
    console.log('✅ Demo users seeded successfully\n');

    // Query the demo users
    const users = await client`
      SELECT email, substring(password_hash, 1, 50) as hash_preview
      FROM users
      WHERE email LIKE 'demo%'
      ORDER BY email
    `;

    console.log('📋 Demo users in database:');
    users.forEach(u => console.log(`  - ${u.email}`));
    console.log('\n🔑 All demo users have password: demo123\n');

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

runDemoMigration();
