import { supabase, formatSupabaseError } from './supabase';
import type { Address } from '../types';
import type { CartItem } from '../types';

export type OnlinePaymentMethod = 'upi' | 'card';

interface CreateOrderParams {
  userId: string | null;
  paymentMethod: OnlinePaymentMethod;
  subtotal: number;
  shipping: number;
  total: number;
  address: Address;
  items: CartItem[];
}

export async function createStoreOrder({
  userId,
  paymentMethod,
  subtotal,
  shipping,
  total,
  address,
  items,
}: CreateOrderParams) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status: 'pending',
      payment_status: 'pending',
      payment_method: paymentMethod,
      subtotal,
      shipping_cost: shipping,
      total,
      shipping_address: address,
    })
    .select()
    .single();

  if (orderError) {
    throw new Error(formatSupabaseError(orderError));
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    product_name: item.product_name,
    size: item.size,
    price: item.price,
    quantity: item.quantity,
    total: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) {
    throw new Error(formatSupabaseError(itemsError));
  }

  return { ...order, order_items: orderItems };
}

export async function markOrderPaymentFailed(orderId: string) {
  await supabase
    .from('orders')
    .update({ payment_status: 'failed' })
    .eq('id', orderId);
}
