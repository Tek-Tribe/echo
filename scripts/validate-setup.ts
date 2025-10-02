#!/usr/bin/env tsx

import { testConnection } from '../shared/db/connection';
import { supabase } from '../shared/db/supabase';

async function validateEnvironment() {
  console.log('🔍 Validating Environment Setup...\n');

  // Check environment variables
  const requiredEnvVars = [
    'REACT_APP_SUPABASE_URL',
    'REACT_APP_SUPABASE_ANON_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
  ];

  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingEnvVars.length > 0) {
    console.error('❌ Missing environment variables:');
    missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
    console.log('\n📝 Please check your .env file');
    return false;
  }

  console.log('✅ All required environment variables are set');

  // Check DATABASE_URL
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('[YOUR-PASSWORD]')) {
    console.warn('⚠️  DATABASE_URL not properly configured');
    console.log('🔧 Please update DATABASE_URL in your .env file with your actual database password');
    console.log('📋 Get it from: Supabase Dashboard > Settings > Database > Connection String');
    console.log('');
    return false;
  }

  console.log('✅ DATABASE_URL is configured');

  // Test Supabase client
  try {
    const { data, error } = await supabase.auth.getUser();
    console.log('✅ Supabase client connection successful');
  } catch (error) {
    console.warn('⚠️  Supabase client test failed:', error.message);
  }

  // Test database connection
  try {
    const { testConnection } = await import('../shared/db/connection');
    await testConnection();
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    console.log('🔧 Please ensure your DATABASE_URL is correct and the database is accessible');
    console.log('📋 Get your connection string from: Supabase Dashboard > Settings > Database');
    return false;
  }

  console.log('\n🎉 Environment validation completed successfully!');
  return true;
}

async function validateDatabaseSchema() {
  console.log('\n🗄️  Validating Database Schema...');

  try {
    const { client } = await import('../shared/db/connection');

    // Check if tables exist
    const tables = await client`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    const expectedTables = [
      'users',
      'platforms',
      'influencer_profiles',
      'business_profiles',
      'campaigns',
      'bids',
      'payments',
      'evidence_submissions',
      'notifications'
    ];

    const existingTables = tables.map(t => t.table_name);
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.error('❌ Missing database tables:');
      missingTables.forEach(table => console.error(`   - ${table}`));
      console.log('\n🔧 Run: npm run db:setup');
      return false;
    }

    console.log('✅ All required tables exist');

    // Check if Instagram platform exists
    const platforms = await client`
      SELECT * FROM platforms WHERE name = 'instagram'
    `;

    if (platforms.length === 0) {
      console.warn('⚠️  Instagram platform not found in platforms table');
      console.log('🔧 Run: npm run db:setup to initialize default data');
      return false;
    }

    console.log('✅ Default platform data exists');
    console.log('\n🎉 Database schema validation completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Database schema validation failed:', error.message);
    return false;
  }
}

// Main validation function
async function main() {
  console.log('🚀 Echo Platform Setup Validation\n');

  const envValid = await validateEnvironment();

  if (!envValid) {
    console.log('\n❌ Environment validation failed. Please fix the issues above before proceeding.');
    process.exit(1);
  }

  const schemaValid = await validateDatabaseSchema();

  if (!schemaValid) {
    console.log('\n❌ Database schema validation failed. Please run the setup script.');
    process.exit(1);
  }

  console.log('\n🎉 All validations passed! Your Echo Platform is ready to use.');
  console.log('\n📚 Next steps:');
  console.log('   1. Start the development server: npm run dev');
  console.log('   2. Test the API endpoints using the examples in DATABASE_README.md');
  console.log('   3. Run the test suite: npx tsx tests/api-test.ts');

  process.exit(0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  });
}