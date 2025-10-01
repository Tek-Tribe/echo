import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Environment variables (optional for setup script)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

// Get database connection string
// For Supabase, you need the direct database connection string
// Format: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL not found. Please set it in your .env file.');
  console.log('🔧 Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
  console.log('📋 Get it from: Supabase Dashboard > Settings > Database > Connection String');

  if (SUPABASE_URL) {
    // Fallback to construct from SUPABASE_URL (this will likely fail without password)
    const supabaseUrl = new URL(SUPABASE_URL);
    const projectRef = supabaseUrl.hostname.split('.')[0];
    console.log(`🔑 Your project ref: ${projectRef}`);
  }

  throw new Error('DATABASE_URL environment variable is required for database operations');
}

// Create postgres client with better configuration
const client = postgres(DATABASE_URL, {
  prepare: false,
  max: 10, // Maximum connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export the client for raw SQL queries if needed
export { client };

// Test connection function
export const testConnection = async () => {
  try {
    await client`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};