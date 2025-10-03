import 'dotenv/config';
import bcrypt from 'bcrypt';

async function seedDemoUsers() {
  try {
    console.log('🚀 Seeding demo users...\n');

    const { client } = await import('../shared/db/connection.js');

    // Generate password hash for 'demo123'
    const passwordHash = await bcrypt.hash('demo123', 10);
    console.log('🔐 Generated password hash for: demo123');
    console.log(`   Hash: ${passwordHash}\n`);

    // Delete existing demo users first
    await client`DELETE FROM users WHERE email LIKE 'demo%@echox.app'`;
    console.log('🗑️  Removed existing demo users\n');

    // Insert business user
    const [businessUser] = await client`
      INSERT INTO users (email, password_hash, user_type, first_name, last_name, is_verified, is_active)
      VALUES ('demo-business@echox.app', ${passwordHash}, 'business', 'EchoX', 'Business', true, true)
      RETURNING id, email
    `;
    console.log(`✅ Created: ${businessUser.email}`);

    // Insert business profile
    await client`
      INSERT INTO business_profiles (user_id, company_name, company_website, industry, description)
      VALUES (
        ${businessUser.id},
        'EchoX Demo Business',
        'https://echox.app',
        'Marketing',
        'Demo business account for exploring the EchoX platform features.'
      )
    `;

    // Insert influencer user
    const [influencerUser] = await client`
      INSERT INTO users (email, password_hash, user_type, first_name, last_name, is_verified, is_active)
      VALUES ('demo-influencer@echox.app', ${passwordHash}, 'influencer', 'EchoX', 'Influencer', true, true)
      RETURNING id, email
    `;
    console.log(`✅ Created: ${influencerUser.email}`);

    // Insert influencer profile
    await client`
      INSERT INTO influencer_profiles (
        user_id, instagram_handle, instagram_followers, engagement_rate,
        bio, niche, location, rate_per_story, rate_per_post
      )
      VALUES (
        ${influencerUser.id},
        'echox.demo',
        15000,
        3.75,
        'Demo influencer account showcasing EchoX collaboration campaigns.',
        'Lifestyle',
        'Global',
        50.00,
        120.00
      )
    `;

    // Insert admin user
    const [adminUser] = await client`
      INSERT INTO users (email, password_hash, user_type, first_name, last_name, is_verified, is_active)
      VALUES ('demo-admin@echox.app', ${passwordHash}, 'admin', 'EchoX', 'Admin', true, true)
      RETURNING id, email
    `;
    console.log(`✅ Created: ${adminUser.email}`);

    // Insert manager user
    const [managerUser] = await client`
      INSERT INTO users (email, password_hash, user_type, first_name, last_name, is_verified, is_active)
      VALUES ('demo-manager@echox.app', ${passwordHash}, 'manager', 'EchoX', 'Manager', true, true)
      RETURNING id, email
    `;
    console.log(`✅ Created: ${managerUser.email}`);

    console.log('\n📋 Demo Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: demo-business@echox.app');
    console.log('Email: demo-influencer@echox.app');
    console.log('Email: demo-admin@echox.app');
    console.log('Email: demo-manager@echox.app');
    console.log('Password: demo123 (for all accounts)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Verify by attempting login
    const testUser = await client`SELECT email, password_hash FROM users WHERE email = 'demo-business@echox.app'`;
    const isValid = await bcrypt.compare('demo123', testUser[0].password_hash);
    console.log(`✅ Password verification test: ${isValid ? 'PASSED' : 'FAILED'}\n`);

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedDemoUsers();
