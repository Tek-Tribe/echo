-- Add timestamp columns to bids table for tracking workflow
ALTER TABLE bids ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE bids ADD COLUMN IF NOT EXISTS work_started_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE bids ADD COLUMN IF NOT EXISTS evidence_submitted_at TIMESTAMP WITH TIME ZONE;

-- Add comment for documentation
COMMENT ON COLUMN bids.accepted_at IS 'Timestamp when bid was accepted by business';
COMMENT ON COLUMN bids.work_started_at IS 'Timestamp when influencer started working on the campaign';
COMMENT ON COLUMN bids.evidence_submitted_at IS 'Timestamp when influencer submitted evidence';
