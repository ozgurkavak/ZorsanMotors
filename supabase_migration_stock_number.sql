-- Create a sequence for stock numbers starting at 10001
CREATE SEQUENCE IF NOT EXISTS vehicle_stock_seq START 10001;

-- Add stock_number column if it doesn't exist
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS stock_number TEXT UNIQUE;

-- Function to set stock number automatically
CREATE OR REPLACE FUNCTION set_stock_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set if not provided (though we usually won't provide it)
  IF NEW.stock_number IS NULL THEN
    NEW.stock_number := 'ZM-' || nextval('vehicle_stock_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run before insert
DROP TRIGGER IF EXISTS trigger_set_stock_number ON vehicles;
CREATE TRIGGER trigger_set_stock_number
BEFORE INSERT ON vehicles
FOR EACH ROW
EXECUTE FUNCTION set_stock_number();

-- Backfill existing rows if they don't have a stock number
DO $$
DECLARE 
  rec RECORD;
BEGIN
  FOR rec IN SELECT id FROM vehicles WHERE stock_number IS NULL LOOP
    UPDATE vehicles 
    SET stock_number = 'ZM-' || nextval('vehicle_stock_seq') 
    WHERE id = rec.id;
  END LOOP;
END $$;
