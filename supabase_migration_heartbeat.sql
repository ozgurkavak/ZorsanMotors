-- Create Heartbeats Table
CREATE TABLE IF NOT EXISTS sync_heartbeats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT NOT NULL, -- 'ALIVE'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sync_heartbeats ENABLE ROW LEVEL SECURITY;

-- Allow Log Read/Write
CREATE POLICY "Allow public read heartbeats" ON sync_heartbeats FOR SELECT USING (true);
CREATE POLICY "Allow service role insert heartbeats" ON sync_heartbeats FOR INSERT WITH CHECK (true);
