-- Phase 1: Database Schema Changes for Dealer Management System (DMS)

-- 1. Add "Cost Accounting" columns to the 'vehicles' table.
-- Using 'IF NOT EXISTS' to be non-destructive and safe.
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS purchase_price NUMERIC,       -- Auction/Buying Price
ADD COLUMN IF NOT EXISTS auction_name TEXT,            -- Source of the vehicle (e.g. 'Manheim')
ADD COLUMN IF NOT EXISTS sale_price NUMERIC,           -- Final Price sold to customer
ADD COLUMN IF NOT EXISTS sold_date TIMESTAMP WITH TIME ZONE, -- Date sold
ADD COLUMN IF NOT EXISTS consignment BOOLEAN DEFAULT FALSE; -- Optional: Is this a consignment vehicle?

-- Note: 'status' column likely exists. We will ensure it has a default.
-- If 'status' does not exist, uncomment the next line:
-- ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Available';

-- 2. Create 'expenses' table to track repairs, transport, fees, etc.
CREATE TABLE IF NOT EXISTS expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE, -- Link to vehicle
    expense_type TEXT NOT NULL, -- e.g. 'Transport', 'Parts', 'Labor', 'Auction Fee'
    amount NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID DEFAULT auth.uid(), -- Track who added the expense
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Grid/Row Level Security (RLS)
-- Expenses should ONLY be visible to authenticated Admins (Service Role or Admin User)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy: Allow full access to authenticated users (assuming only Admins log in via Supabase Auth)
-- If you have public users logging in, you will need a stricter policy (e.g. checking a 'role' table).
-- For now, consistent with the brief "Only authenticated Admins can read/write".
CREATE POLICY "Enable all access for authenticated users" ON expenses
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Create a View or Function for Profit Calculation (Optional but recommended)
-- This allows specific queries to get profit without recalculating in Frontend everytime.
CREATE OR REPLACE VIEW vehicle_financial_summary AS
SELECT 
    v.id,
    v.vin,
    v.make,
    v.model,
    v.status,
    v.purchase_price,
    v.sale_price,
    COALESCE(SUM(e.amount), 0) as total_expenses,
    (COALESCE(v.purchase_price, 0) + COALESCE(SUM(e.amount), 0)) as total_cost,
    (v.sale_price - (COALESCE(v.purchase_price, 0) + COALESCE(SUM(e.amount), 0))) as profit
FROM vehicles v
LEFT JOIN expenses e ON v.id = e.vehicle_id
GROUP BY v.id;
