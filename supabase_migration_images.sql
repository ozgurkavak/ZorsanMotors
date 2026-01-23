-- Add images array column to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS images text[] DEFAULT ARRAY[]::text[];

-- Update the existing rows to populate images array from the single image_url if images is empty
UPDATE vehicles SET images = ARRAY[image_url] WHERE images IS NULL OR array_length(images, 1) IS NULL;
