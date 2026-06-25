-- ============================================================
-- KAMDHARA FARMS — Complete Supabase Setup (run once in SQL Editor)
-- Create your own project at https://supabase.com first, then paste this entire file.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  category TEXT DEFAULT 'A2 Ghee',
  image_url TEXT DEFAULT '',
  gallery_urls JSONB DEFAULT '[]',
  benefits JSONB DEFAULT '[]',
  nutrition_info JSONB DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  apply_gst BOOLEAN DEFAULT false,
  gst_rate NUMERIC(5,2) DEFAULT 5.00,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'upi',
  subtotal NUMERIC(10,2) DEFAULT 0,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  coupon_code TEXT,
  shipping_address JSONB DEFAULT '{}',
  billing_address JSONB,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT DEFAULT '',
  comment TEXT DEFAULT '',
  user_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- ============================================================
-- ORDER NUMBER AUTO-GENERATION
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'KF' || nextval('order_number_seq')::text;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ADMIN HELPER FUNCTION
-- ============================================================

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

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

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

-- ============================================================
-- SAMPLE PRODUCTS (optional starter catalog)
-- ============================================================

INSERT INTO products (name, slug, description, short_description, category, image_url, benefits, featured)
VALUES
  (
    'A2 Gir Cow Ghee',
    'a2-gir-cow-ghee',
    'Pure A2 Gir Cow Ghee handcrafted using the traditional bilona method. Made from the milk of free-grazing Gir cows in Gujarat.',
    'Traditional bilona method A2 ghee from Gir cows',
    'A2 Ghee',
    'https://images.pexels.com/photos/4226882/pexels-photo-4226882.jpeg?auto=compress&cs=tinysrgb&w=800',
    '["Rich in Omega-3 fatty acids", "Boosts immunity", "Improves digestion", "100% natural, no preservatives"]',
    true
  ),
  (
    'Desi Cow Ghee',
    'desi-cow-ghee',
    'Premium desi cow ghee made from indigenous cow milk using slow-cooking methods for authentic taste and aroma.',
    'Premium desi cow ghee with authentic aroma',
    'Cow Ghee',
    'https://images.pexels.com/photos/4226880/pexels-photo-4226880.jpeg?auto=compress&cs=tinysrgb&w=800',
    '["High smoke point for cooking", "Supports gut health", "Natural energy source"]',
    false
  ),
  (
    'Buffalo Ghee',
    'buffalo-ghee',
    'Rich and creamy buffalo ghee perfect for traditional Indian cooking and sweets.',
    'Rich creamy buffalo ghee for cooking',
    'Buffalo Ghee',
    'https://images.pexels.com/photos/6294326/pexels-photo-6294326.jpeg?auto=compress&cs=tinysrgb&w=800',
    '["Higher fat content", "Ideal for sweets", "Rich creamy texture"]',
    false
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_variants (product_id, size, price, stock)
SELECT p.id, v.size, v.price, v.stock
FROM products p
CROSS JOIN (VALUES
  ('250ml', 449, 50),
  ('500ml', 849, 50),
  ('1L', 1599, 30)
) AS v(size, price, stock)
WHERE p.slug = 'a2-gir-cow-ghee'
AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

INSERT INTO product_variants (product_id, size, price, stock)
SELECT p.id, v.size, v.price, v.stock
FROM products p
CROSS JOIN (VALUES
  ('500ml', 699, 40),
  ('1L', 1299, 25)
) AS v(size, price, stock)
WHERE p.slug = 'desi-cow-ghee'
AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

INSERT INTO product_variants (product_id, size, price, stock)
SELECT p.id, v.size, v.price, v.stock
FROM products p
CROSS JOIN (VALUES
  ('500ml', 599, 35),
  ('1L', 1099, 20)
) AS v(size, price, stock)
WHERE p.slug = 'buffalo-ghee'
AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

-- ============================================================
-- STORAGE — Product images bucket (admin uploads)
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admins_upload_product_images" ON storage.objects;
CREATE POLICY "admins_upload_product_images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "admins_update_product_images" ON storage.objects;
CREATE POLICY "admins_update_product_images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND public.is_admin())
WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "admins_delete_product_images" ON storage.objects;
CREATE POLICY "admins_delete_product_images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND public.is_admin());

-- ============================================================
-- DONE! Next steps:
-- 1. Copy Project URL + anon key into project/.env
-- 2. Sign up on website, then run:
--    UPDATE profiles SET is_admin = true WHERE email = 'your@email.com';
-- 3. Add Razorpay secrets in Edge Functions settings
-- ============================================================
