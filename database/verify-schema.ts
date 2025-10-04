import { db } from '../shared/db/connection';
import { sql } from 'drizzle-orm';

async function verifySchema() {
  try {
    console.log('Checking bids table columns...');
    const result = await db.execute(sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'bids'
      ORDER BY column_name
    `);

    console.log('\nBids table columns:');
    const rows = Array.isArray(result) ? result : result.rows || [];
    rows.forEach((row: any) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    const requiredColumns = ['accepted_at', 'work_started_at', 'evidence_submitted_at', 'evidence_confirmed_at'];
    const existingColumns = rows.map((r: any) => r.column_name);

    console.log('\n✅ Verification:');
    requiredColumns.forEach(col => {
      const exists = existingColumns.includes(col);
      console.log(`  ${exists ? '✓' : '✗'} ${col}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

verifySchema();
