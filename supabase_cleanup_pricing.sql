-- 1. Drop the dependent view first
DROP VIEW IF EXISTS vehicle_financial_summary;

-- 2. Migrate existing sale_price data to price if price is missing
UPDATE vehicles
SET price = sale_price
WHERE price IS NULL AND sale_price IS NOT NULL;

-- 3. Drop the redundant column
ALTER TABLE vehicles DROP COLUMN sale_price;

-- 4. Recreate the View using 'price' as the Sale Price
CREATE OR REPLACE VIEW vehicle_financial_summary AS
SELECT 
    v.id,
    v.vin,
    v.make,
    v.model,
    v.status,
    v.purchase_price,
    v.price as sale_price, -- Mapping price as sale_price for consistency in queries
    COALESCE(SUM(e.amount), 0) as total_expenses,
    (COALESCE(v.purchase_price, 0) + COALESCE(SUM(e.amount), 0)) as total_cost,
    (v.price - (COALESCE(v.purchase_price, 0) + COALESCE(SUM(e.amount), 0))) as profit
FROM vehicles v
LEFT JOIN expenses e ON v.id = e.vehicle_id
GROUP BY v.id;
