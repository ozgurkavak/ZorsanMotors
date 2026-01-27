-- 1. Ensure VIN is Unique (Crucial for Upsert)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vehicles_vin_key') THEN
        ALTER TABLE vehicles ADD CONSTRAINT vehicles_vin_key UNIQUE (vin);
    END IF;
END $$;

-- 2. Create Sync Logs Table (For the Dashboard)
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'STARTED', 'SYNC_SUCCESS', 'SYNC_ERROR', etc.
    message TEXT,
    details JSONB, -- Stores detailed error info or vehicle counts
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS (Row Level Security) for Admin Access
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Allow Admins to View Logs (assuming you use standard supabase auth)
-- For now, we'll allow public read/write to test, but ideally restrictive policies later
CREATE POLICY "Allow public read logs" ON sync_logs FOR SELECT USING (true);
CREATE POLICY "Allow service role insert logs" ON sync_logs FOR INSERT WITH CHECK (true);
