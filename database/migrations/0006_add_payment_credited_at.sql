-- Add evidence_confirmed_at timestamp column to bids table
ALTER TABLE bids ADD COLUMN IF NOT EXISTS evidence_confirmed_at TIMESTAMP WITH TIME ZONE;
