-- GST fields for products (Kamdhara Farms)

ALTER TABLE products ADD COLUMN apply_gst BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN gst_rate NUMERIC(5,2) DEFAULT 5.00;
