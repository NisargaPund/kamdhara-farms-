-- Run this if product update fails with 400 error
-- Adds columns that may be missing from an earlier partial setup

ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_urls JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS apply_gst BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 5.00;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
