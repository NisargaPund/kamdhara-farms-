import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*)
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
      product_variants (*)
    `)
    .eq('featured', true);

  if (error) throw error;
  return data;
}
