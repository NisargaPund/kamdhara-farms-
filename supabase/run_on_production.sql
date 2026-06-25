-- ============================================================
-- Kamdhara Farms — run once in Supabase SQL Editor after deploy
-- Fixes signup profile trigger, variant images, and product-images storage
-- ============================================================

-- Fix profile auto-creation on signup (RLS-safe via SECURITY DEFINER)
-- Run if signup fails with "Database error saving new user"

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE
      WHEN profiles.full_name IS NULL OR profiles.full_name = ''
      THEN EXCLUDED.full_name
      ELSE profiles.full_name
    END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS whatsapp_notifications BOOLEAN DEFAULT true;

DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;

-- Per-variant jar/product images (e.g. 500ml vs 1L bottle photos)
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';

-- ============================================================
-- STORAGE - Product images bucket (admin uploads)
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