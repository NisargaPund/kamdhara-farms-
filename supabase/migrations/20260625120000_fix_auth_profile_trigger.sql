-- Fix profile auto-creation on signup (RLS-safe via SECURITY DEFINER)
-- Run in Supabase SQL Editor if signup fails with "Database error saving new user"

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

-- Ensure notification preference columns exist (profile account system)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS whatsapp_notifications BOOLEAN DEFAULT true;

-- Remove duplicate read policy from admin_panel migration (profiles_read_own covers the same rule)
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
