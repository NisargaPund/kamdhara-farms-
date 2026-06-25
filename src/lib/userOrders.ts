import { supabase } from './supabase';
import type { Order } from '../types';
import { isActiveOrder } from './orderStatus';

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items (*)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getUserOrderById(userId: string, orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items (*)`)
    .eq('user_id', userId)
    .eq('id', orderId)
    .single();

  if (error) return null;
  return data;
}

export function splitOrders(orders: Order[]): { current: Order[]; history: Order[] } {
  const current = orders.filter((o) => isActiveOrder(o.status));
  const history = orders.filter((o) => !isActiveOrder(o.status));
  return { current, history };
}

export function subscribeToUserOrders(
  userId: string,
  onUpdate: (order: Order) => void
): () => void {
  const channel = supabase
    .channel(`user-orders-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${userId}`,
      },
      async (payload) => {
        const updated = payload.new as Order;
        const full = await getUserOrderById(userId, updated.id);
        if (full) onUpdate(full);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
