import { db } from '../shared/db/connection';
import { sql } from 'drizzle-orm';

async function addColumn() {
  try {
    console.log('Adding evidence_confirmed_at column...');
    await db.execute(sql`ALTER TABLE bids ADD COLUMN IF NOT EXISTS evidence_confirmed_at TIMESTAMP WITH TIME ZONE`);
    console.log('✅ evidence_confirmed_at column added successfully!');

    // Verify it was added
    const result = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'bids' AND column_name = 'evidence_confirmed_at'
    `);
    console.log('Verification:', result);

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

addColumn();
