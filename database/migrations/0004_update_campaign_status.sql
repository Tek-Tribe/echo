-- Update campaign status enum to use new statuses
-- PostgreSQL doesn't allow direct enum modification, so we need to:
-- 1. Add new values to the enum
-- 2. Update existing data
-- 3. Remove old values (complex, so we'll keep them for compatibility)

-- Add new enum values
ALTER TYPE campaign_status ADD VALUE IF NOT EXISTS 'bid';
ALTER TYPE campaign_status ADD VALUE IF NOT EXISTS 'running';
ALTER TYPE campaign_status ADD VALUE IF NOT EXISTS 'closed';

-- Migrate existing data
-- active -> bid (campaigns accepting bids)
-- paused -> running (campaigns in progress)
-- completed -> closed (campaigns finished)
-- cancelled -> closed (campaigns cancelled)

UPDATE campaigns SET status = 'bid' WHERE status = 'active';
UPDATE campaigns SET status = 'running' WHERE status = 'paused';
UPDATE campaigns SET status = 'closed' WHERE status = 'completed' OR status = 'cancelled';
