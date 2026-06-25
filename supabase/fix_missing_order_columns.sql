-- Run this if admin order status/tracking updates fail with 400 errors
-- Adds columns that may be missing from an earlier partial setup

ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier TEXT DEFAULT 'Kamdhara Farms Delivery';

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_notifications BOOLEAN DEFAULT true;

-- Also run migrations/20260624130000_orders_delivery_trigger.sql
-- and migrations/20260624140000_order_status_history.sql for full order activity logging
