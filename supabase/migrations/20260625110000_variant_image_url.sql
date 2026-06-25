-- Per-variant jar/product images (e.g. 500ml vs 1L bottle photos)
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
