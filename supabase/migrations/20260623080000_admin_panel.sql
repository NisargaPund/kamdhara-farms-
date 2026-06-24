-- Admin role support for Kamdhara Farms admin panel

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Admin full access to products
CREATE POLICY "admins_manage_products" ON products
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin full access to product variants
CREATE POLICY "admins_manage_variants" ON product_variants
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin can view and update all orders
CREATE POLICY "admins_view_orders" ON orders
  FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "admins_update_orders" ON orders
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin can view all order items
CREATE POLICY "admins_view_order_items" ON order_items
  FOR SELECT TO authenticated
  USING (is_admin());

-- Admin can view all profiles
CREATE POLICY "admins_view_profiles" ON profiles
  FOR SELECT TO authenticated
  USING (is_admin());

-- Admin can manage reviews
CREATE POLICY "admins_manage_reviews" ON reviews
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Allow users to read their own admin status
CREATE POLICY "users_read_own_profile" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR is_admin());
