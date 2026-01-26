-- Add text fields for flexible property descriptions
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS price_text text,
ADD COLUMN IF NOT EXISTS bedrooms_text text,
ADD COLUMN IF NOT EXISTS bathrooms_text text,
ADD COLUMN IF NOT EXISTS parking_text text,
ADD COLUMN IF NOT EXISTS area_text text;