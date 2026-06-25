-- Prepaid-only checkout: default new orders to online UPI payment
ALTER TABLE orders ALTER COLUMN payment_method SET DEFAULT 'upi';
