import 'dotenv/config';
import { client } from '../shared/db/connection';

async function addManagerDemo() {
  try {
    console.log('🚀 Adding manager demo user...');

    // Password hash for "demo123"
    const demoPasswordHash = '$2b$10$khRr/OWav/JUNuD8zWE6VeR.BorXpPUtmgWPsiYiw0xegAXUySula';

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

    console.log('✅ Manager demo user added successfully!');
    console.log('📧 Email: demo-manager@echox.app');
    console.log('🔑 Password: demo123');

  } catch (error: any) {
    console.error('❌ Error adding manager demo user:', error);
    process.exit(1);
  } finally {
    try {
      await client.end();
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addManagerDemo();
}

export { addManagerDemo };
