-- Razorpay payment tracking on orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);

-- Allow marking online payment orders as failed (client-side, before verification)
CREATE POLICY "orders_guest_mark_failed" ON orders FOR UPDATE
  TO anon, authenticated
  USING (
    user_id IS NULL
    AND payment_status = 'pending'
    AND payment_method IN ('upi', 'card')
  )
  WITH CHECK (payment_status = 'failed' AND user_id IS NULL);

CREATE POLICY "orders_user_mark_failed" ON orders FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    AND payment_status = 'pending'
    AND payment_method IN ('upi', 'card')
  )
  WITH CHECK (payment_status = 'failed');
