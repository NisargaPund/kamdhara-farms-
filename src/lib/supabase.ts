import { createClient, type PostgrestError } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
