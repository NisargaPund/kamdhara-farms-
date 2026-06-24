-- Allow guest orders (user_id is null)
CREATE POLICY "orders_guest_insert" ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id IS NULL);

-- Allow guest order items
CREATE POLICY "order_items_guest_insert" ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id IS NULL
  ));

-- Allow viewing guest orders by order_id (for confirmation page)
CREATE POLICY "orders_guest_select" ON orders FOR SELECT
  TO anon, authenticated
  USING (user_id IS NULL);