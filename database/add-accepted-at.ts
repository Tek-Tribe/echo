import { db } from '../shared/db/connection';
import { sql } from 'drizzle-orm';

async function addColumn() {
  try {
    console.log('Adding accepted_at column...');
    await db.execute(sql`ALTER TABLE bids ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE`);
    console.log('✅ accepted_at column added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

addColumn();
