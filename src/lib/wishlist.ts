import { create } from 'zustand';
import { supabase } from './supabase';

export interface WishlistItem {
  id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  image_url: string;
  price: number;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  fetchWishlist: (userId: string) => Promise<void>;
  addToWishlist: (
    userId: string,
    item: Omit<WishlistItem, 'id'>
  ) => Promise<void>;
  removeFromWishlist: (userId: string, productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id,
          product_id,
          products (
            name,
            slug,
            image_url,
            product_variants (price)
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const items: WishlistItem[] = (data || []).map((row: Record<string, unknown>) => {
        const products = row.products as {
          name: string;
          slug: string;
          image_url: string;
          product_variants: { price: number }[];
        };
        return {
          id: row.id as string,
          product_id: row.product_id as string,
          product_name: products.name,
          product_slug: products.slug,
          image_url: products.image_url,
          price: products.product_variants?.[0]?.price || 0,
        };
      });

      set({ items });
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },

  addToWishlist: async (userId, item) => {
    const { error } = await supabase.from('wishlist').insert({
      user_id: userId,
      product_id: item.product_id,
    });
    if (error) throw error;

    set((state) => ({
      items: [...state.items, { ...item, id: crypto.randomUUID() }],
    }));
  },

  removeFromWishlist: async (userId, productId) => {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;

    set((state) => ({
      items: state.items.filter((i) => i.product_id !== productId),
    }));
  },

  isInWishlist: (productId) => {
    return get().items.some((i) => i.product_id === productId);
  },
}));
