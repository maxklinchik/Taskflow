-- Add due_time column to homework table
ALTER TABLE homework ADD COLUMN due_time TEXT;

-- Make events time column nullable (if it's not already)
ALTER TABLE events ALTER COLUMN time DROP NOT NULL;
