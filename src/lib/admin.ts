import { supabase, formatSupabaseError } from './supabase';
import { sendOrderNotification } from './notifications';
import { NOTIFY_STATUSES } from './orderStatus';
import type {
  AdminOrderDetail,
  AdminStats,
  Order,
  Product,
  ProductFormData,
  ProductVariant,
  Profile,
} from '../types';

const ONLINE_PAYMENT_METHODS = ['upi', 'card'] as const;

export function countsTowardOnlinePaidRevenue(order: {
  payment_method: string;
  payment_status: string;
  status: string;
}): boolean {
  return (
    (ONLINE_PAYMENT_METHODS as readonly string[]).includes(order.payment_method) &&
    order.payment_status === 'paid' &&
    order.status !== 'cancelled'
  );
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();

  if (error) return false;
  return data?.is_admin === true;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [ordersRes, productsRes, profilesRes, variantsRes] = await Promise.all([
    supabase.from('orders').select('id, status, total, payment_method, payment_status'),
    supabase.from('products').select('id'),
    supabase.from('profiles').select('id').eq('is_admin', false),
    supabase.from('product_variants').select('stock').lt('stock', 10),
  ]);

  const orders = ordersRes.data || [];
  const totalRevenue = orders
    .filter(countsTowardOnlinePaidRevenue)
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    totalRevenue,
    totalProducts: productsRes.data?.length || 0,
    lowStockCount: variantsRes.data?.length || 0,
    totalCustomers: profilesRes.data?.length || 0,
  };
}

export async function getAdminOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAdminOrderDetail(orderId: string): Promise<AdminOrderDetail> {
  const [historyRes, notificationsRes, orderRes] = await Promise.all([
    supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false }),
    supabase
      .from('order_notifications')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false }),
    supabase.from('orders').select('user_id').eq('id', orderId).single(),
  ]);

  if (historyRes.error) throw historyRes.error;
  if (notificationsRes.error) throw notificationsRes.error;

  let customer: Profile | null = null;
  if (orderRes.data?.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', orderRes.data.user_id)
      .single();
    customer = profile;
  }

  return {
    history: historyRes.data || [],
    notifications: notificationsRes.data || [],
    customer,
  };
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  paymentStatus?: string,
  extras?: { tracking_number?: string; estimated_delivery?: string; carrier?: string }
) {
  const { data: existing, error: fetchError } = await supabase
    .from('orders')
    .select('status, payment_status, tracking_number, carrier, estimated_delivery')
    .eq('id', orderId)
    .single();

  if (fetchError) {
    throw new Error(formatSupabaseError(fetchError));
  }

  const previousStatus = existing?.status;
  const updates: Record<string, string | null> = {};

  if (status !== existing?.status) {
    updates.status = status;
  }
  if (paymentStatus && paymentStatus !== existing?.payment_status) {
    updates.payment_status = paymentStatus;
  }
  if (extras) {
    if (
      extras.tracking_number !== undefined &&
      extras.tracking_number !== (existing?.tracking_number ?? '')
    ) {
      updates.tracking_number = extras.tracking_number || null;
    }
    if (extras.carrier !== undefined && extras.carrier !== (existing?.carrier ?? '')) {
      updates.carrier = extras.carrier || null;
    }
    if (extras.estimated_delivery !== undefined) {
      const existingDate = existing?.estimated_delivery?.split('T')[0] ?? '';
      const nextDate = extras.estimated_delivery || '';
      if (nextDate !== existingDate) {
        updates.estimated_delivery = nextDate || null;
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return;
  }

  const { error } = await supabase.from('orders').update(updates).eq('id', orderId);

  if (error) {
    throw new Error(formatSupabaseError(error));
  }

  const newStatus = updates.status ?? previousStatus;
  if (
    previousStatus !== newStatus &&
    NOTIFY_STATUSES.includes(newStatus as (typeof NOTIFY_STATUSES)[number])
  ) {
    sendOrderNotification({ orderId, type: 'status_update', previousStatus });
  }
}

export async function getAdminProducts(): Promise<
  (Product & { product_variants: ProductVariant[] })[]
> {
  const { data, error } = await supabase
    .from('products')
    .select(`*, product_variants (*)`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createProduct(form: ProductFormData) {
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      name: form.name,
      slug: form.slug,
      description: form.description,
      short_description: form.short_description,
      category: form.category,
      image_url: form.image_url,
      gallery_urls: form.gallery_urls.filter(Boolean),
      benefits: form.benefits.filter(Boolean),
      nutrition_info: {},
      featured: form.featured,
      apply_gst: form.apply_gst,
      gst_rate: form.gst_rate,
    })
    .select()
    .single();

  if (productError) throw productError;

  const variants = form.variants
    .filter((v) => v.size && v.price > 0)
    .map((v) => ({
      product_id: product.id,
      size: v.size,
      price: v.price,
      stock: v.stock,
    }));

  if (variants.length > 0) {
    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(variants);
    if (variantError) throw variantError;
  }

  return product;
}

export async function updateProduct(
  productId: string,
  form: ProductFormData,
  existingVariantIds: string[]
) {
  const { data: updatedProduct, error: productError } = await supabase
    .from('products')
    .update({
      name: form.name,
      slug: form.slug,
      description: form.description,
      short_description: form.short_description,
      category: form.category,
      image_url: form.image_url,
      gallery_urls: form.gallery_urls.filter(Boolean),
      benefits: form.benefits.filter(Boolean),
      featured: form.featured,
      apply_gst: form.apply_gst,
      gst_rate: form.gst_rate,
    })
    .eq('id', productId)
    .select()
    .single();

  if (productError) throw productError;
  if (!updatedProduct) {
    throw new Error('Product update failed. Confirm your account has admin access.');
  }

  const keptIds = form.variants
    .map((v) => v.id)
    .filter(Boolean) as string[];

  const toDelete = existingVariantIds.filter((id) => !keptIds.includes(id));
  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('product_variants')
      .delete()
      .in('id', toDelete);
    if (deleteError) throw deleteError;
  }

  for (const variant of form.variants.filter((v) => v.size && v.price >= 0)) {
    if (variant.id) {
      const { error: variantError } = await supabase
        .from('product_variants')
        .update({ size: variant.size, price: variant.price, stock: variant.stock })
        .eq('id', variant.id);
      if (variantError) throw variantError;
    } else if (variant.price > 0) {
      const { error: insertError } = await supabase.from('product_variants').insert({
        product_id: productId,
        size: variant.size,
        price: variant.price,
        stock: variant.stock,
      });
      if (insertError) throw insertError;
    }
  }

  return updatedProduct;
}

export async function deleteProduct(productId: string) {
  await supabase.from('product_variants').delete().eq('product_id', productId);
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) throw error;
}

export async function getAdminCustomers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getRecentOrders(limit = 5): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items (*)`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}
