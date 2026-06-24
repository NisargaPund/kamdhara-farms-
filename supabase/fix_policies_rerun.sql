-- Re-run RLS policies only (idempotent).
-- Use when setup_complete.sql fails with "policy already exists" errors.
-- Requires tables and is_admin() to already exist.

-- Profiles
DROP POLICY IF EXISTS "profiles_read_own" ON profiles;
CREATE POLICY "profiles_read_own" ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "admins_view_profiles" ON profiles;
CREATE POLICY "admins_view_profiles" ON profiles FOR SELECT TO authenticated
  USING (is_admin());

-- Products (public read)
DROP POLICY IF EXISTS "products_public_read" ON products;
CREATE POLICY "products_public_read" ON products FOR SELECT TO anon, authenticated
  USING (true);
DROP POLICY IF EXISTS "admins_manage_products" ON products;
CREATE POLICY "admins_manage_products" ON products FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Product variants (public read)
DROP POLICY IF EXISTS "variants_public_read" ON product_variants;
CREATE POLICY "variants_public_read" ON product_variants FOR SELECT TO anon, authenticated
  USING (true);
DROP POLICY IF EXISTS "admins_manage_variants" ON product_variants;
CREATE POLICY "admins_manage_variants" ON product_variants FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Orders
DROP POLICY IF EXISTS "orders_user_insert" ON orders;
CREATE POLICY "orders_user_insert" ON orders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
DROP POLICY IF EXISTS "orders_guest_insert" ON orders;
CREATE POLICY "orders_guest_insert" ON orders FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL);
DROP POLICY IF EXISTS "orders_user_select" ON orders;
CREATE POLICY "orders_user_select" ON orders FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "orders_guest_select" ON orders;
CREATE POLICY "orders_guest_select" ON orders FOR SELECT TO anon, authenticated
  USING (user_id IS NULL);
DROP POLICY IF EXISTS "admins_view_orders" ON orders;
CREATE POLICY "admins_view_orders" ON orders FOR SELECT TO authenticated
  USING (is_admin());
DROP POLICY IF EXISTS "admins_update_orders" ON orders;
CREATE POLICY "admins_update_orders" ON orders FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "orders_guest_mark_failed" ON orders;
CREATE POLICY "orders_guest_mark_failed" ON orders FOR UPDATE TO anon, authenticated
  USING (user_id IS NULL AND payment_status = 'pending' AND payment_method IN ('upi', 'card'))
  WITH CHECK (payment_status = 'failed' AND user_id IS NULL);
DROP POLICY IF EXISTS "orders_user_mark_failed" ON orders;
CREATE POLICY "orders_user_mark_failed" ON orders FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND payment_status = 'pending' AND payment_method IN ('upi', 'card'))
  WITH CHECK (payment_status = 'failed');

-- Order items
DROP POLICY IF EXISTS "order_items_insert" ON order_items;
CREATE POLICY "order_items_insert" ON order_items FOR INSERT TO anon, authenticated
  WITH CHECK (true);
DROP POLICY IF EXISTS "order_items_select" ON order_items;
CREATE POLICY "order_items_select" ON order_items FOR SELECT TO anon, authenticated
  USING (true);
DROP POLICY IF EXISTS "admins_view_order_items" ON order_items;
CREATE POLICY "admins_view_order_items" ON order_items FOR SELECT TO authenticated
  USING (is_admin());

-- Reviews
DROP POLICY IF EXISTS "reviews_public_read" ON reviews;
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT TO anon, authenticated
  USING (true);
DROP POLICY IF EXISTS "reviews_user_insert" ON reviews;
CREATE POLICY "reviews_user_insert" ON reviews FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "admins_manage_reviews" ON reviews;
CREATE POLICY "admins_manage_reviews" ON reviews FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Wishlist
DROP POLICY IF EXISTS "wishlist_own" ON wishlist;
CREATE POLICY "wishlist_own" ON wishlist FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
