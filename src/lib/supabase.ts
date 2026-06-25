import { createClient, type AuthError, type PostgrestError } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Auth API errors — map common codes to actionable messages. */
export function formatAuthError(error: unknown): string {
  if (!error) return 'Authentication failed';

  const auth = error as AuthError;
  if (auth.code === 'email_not_confirmed') {
    return 'Please verify your email before signing in. Check your inbox for the confirmation link.';
  }
  if (auth.code === 'invalid_credentials') {
    return 'Invalid email or password. If you just signed up, confirm your email first.';
  }
  if (auth.code === 'user_already_registered') {
    return 'An account with this email already exists. Please sign in.';
  }
  if (auth.message?.includes('Database error saving new user')) {
    return 'Account setup failed on the server. Run migration 20260625120000_fix_auth_profile_trigger.sql in the Supabase SQL Editor.';
  }

  if (auth.message) return auth.message;
  return formatSupabaseError(error);
}

/** Postgrest errors are plain objects, not Error instances — format for UI/logging. */
export function formatSupabaseError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (error && typeof error === 'object') {
    const pg = error as PostgrestError;
    const parts = [pg.message, pg.details, pg.hint, pg.code ? `(${pg.code})` : null].filter(
      Boolean
    );
    if (parts.length > 0) return parts.join(' — ');
  }

  if (typeof error === 'string') return error;

  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*),
      reviews (rating)
    `)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*),
      reviews (*)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*),
      reviews (rating)
    `)
    .eq('featured', true);

  if (error) throw error;
  return data;
}
