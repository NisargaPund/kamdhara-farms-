export const ORDER_STAGES = [
  { key: 'confirmed', label: 'Order Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
] as const;

export type OrderStageKey = (typeof ORDER_STAGES)[number]['key'];

export const ALL_ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ALL_ORDER_STATUSES)[number];

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'out_for_delivery',
];

export const COMPLETED_ORDER_STATUSES: OrderStatus[] = ['delivered', 'cancelled'];

export const NOTIFY_STATUSES: OrderStatus[] = [
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
];

export function getStageIndex(status: string): number {
  const idx = ORDER_STAGES.findIndex((s) => s.key === status);
  if (idx >= 0) return idx;
  if (status === 'pending') return -1;
  if (status === 'cancelled') return -2;
  return -1;
}

export function formatOrderStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export const statusBadgeColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  packed: 'bg-amber-100 text-amber-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function isActiveOrder(status: string): boolean {
  return ACTIVE_ORDER_STATUSES.includes(status as OrderStatus);
}

export function estimateDeliveryDate(fromDate = new Date()): string {
  const d = new Date(fromDate);
  d.setDate(d.getDate() + 5);
  return d.toISOString().split('T')[0];
}

export function buildTrackingUrl(orderNumber: string, trackingNumber?: string | null): string {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const params = new URLSearchParams({ order: orderNumber });
  if (trackingNumber) params.set('tracking', trackingNumber);
  return `${siteUrl}/account?tab=current-orders&${params.toString()}`;
}
