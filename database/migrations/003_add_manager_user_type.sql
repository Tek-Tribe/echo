-- Add 'manager' to user_type enum
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'manager';
