-- Add neighborhood column to properties table
ALTER TABLE public.properties 
ADD COLUMN neighborhood text;

-- Update existing records to use current location as city (admin can fix later)
COMMENT ON COLUMN public.properties.neighborhood IS 'Bairro do imóvel';
COMMENT ON COLUMN public.properties.location IS 'Cidade do imóvel';