import { Clock, Mail, MessageCircle, Package, CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { formatOrderStatus, statusBadgeColors } from '../../lib/orderStatus';
import type { OrderNotificationLog, OrderStatusHistoryEntry } from '../../types';

interface OrderActivityTimelineProps {
  history: OrderStatusHistoryEntry[];
  notifications: OrderNotificationLog[];
  loading?: boolean;
}

function eventIcon(eventType: string) {
  switch (eventType) {
    case 'order_created':
      return ShoppingBag;
    case 'payment_change':
      return CreditCard;
    case 'tracking_update':
      return Truck;
    default:
      return Package;
  }
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function describeHistoryEntry(entry: OrderStatusHistoryEntry): string {
  switch (entry.event_type) {
    case 'order_created':
      return `Order placed with status "${formatOrderStatus(entry.new_status || 'pending')}"`;
    case 'status_change':
      return `Status updated: ${formatOrderStatus(entry.old_status || '')} → ${formatOrderStatus(entry.new_status || '')}`;
    case 'payment_change':
      return `Payment status: ${entry.old_status || '—'} → ${entry.new_status || '—'}`;
    case 'tracking_update': {
      const meta = entry.metadata || {};
      const parts: string[] = [];
      if (meta.old_tracking_number !== meta.new_tracking_number && meta.new_tracking_number) {
        parts.push(`Tracking: ${meta.new_tracking_number}`);
      }
      if (meta.old_carrier !== meta.new_carrier && meta.new_carrier) {
        parts.push(`Carrier: ${meta.new_carrier}`);
      }
      if (meta.old_estimated_delivery !== meta.new_estimated_delivery && meta.new_estimated_delivery) {
        parts.push(
          `Est. delivery: ${new Date(String(meta.new_estimated_delivery)).toLocaleDateString('en-IN')}`
        );
      }
      return parts.length > 0 ? parts.join(' · ') : 'Tracking details updated';
    }
    default:
      return entry.notes || 'Order updated';
  }
}

function notificationLabel(n: OrderNotificationLog): string {
  const type =
    n.notification_type === 'order_placed' ? 'Order confirmation' : 'Status update';
  const channel = n.channel === 'email' ? 'Email' : 'WhatsApp';
  return `${channel} — ${type}`;
}

export default function OrderActivityTimeline({
  history,
  notifications,
  loading,
}: OrderActivityTimelineProps) {
  if (loading) {
    return <p className="text-sm text-medium-brown py-4">Loading activity...</p>;
  }

  const timeline = [
    ...history.map((h) => ({
      id: h.id,
      kind: 'history' as const,
      created_at: h.created_at,
      entry: h,
    })),
    ...notifications.map((n) => ({
      id: n.id,
      kind: 'notification' as const,
      created_at: n.created_at,
      entry: n,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (timeline.length === 0) {
    return (
      <p className="text-sm text-medium-brown py-4">
        No activity recorded yet. Changes will appear here automatically.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {timeline.map((item, index) => {
        const isLast = index === timeline.length - 1;

        if (item.kind === 'history') {
          const entry = item.entry;
          const Icon = eventIcon(entry.event_type);

          return (
            <div key={item.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-gold" />
                </div>
                {!isLast && <div className="w-px flex-1 bg-medium-brown/20 my-1" />}
              </div>
              <div className={`pb-5 flex-1 min-w-0 ${isLast ? '' : ''}`}>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {entry.event_type === 'status_change' && entry.new_status && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusBadgeColors[entry.new_status] || 'bg-gray-100'
                      }`}
                    >
                      {formatOrderStatus(entry.new_status)}
                    </span>
                  )}
                  {entry.event_type === 'order_created' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New Order
                    </span>
                  )}
                  {entry.event_type === 'payment_change' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                      Payment
                    </span>
                  )}
                  {entry.event_type === 'tracking_update' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Tracking
                    </span>
                  )}
                  <span className="text-xs text-medium-brown flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(entry.created_at)}
                  </span>
                </div>
                <p className="text-sm text-dark-brown">{describeHistoryEntry(entry)}</p>
                {entry.notes && entry.event_type !== 'status_change' && entry.event_type !== 'payment_change' && (
                  <p className="text-xs text-medium-brown mt-0.5">{entry.notes}</p>
                )}
              </div>
            </div>
          );
        }

        const notification = item.entry;
        const NotifIcon = notification.channel === 'email' ? Mail : MessageCircle;
        const sent = notification.status === 'sent';
        const skipped = notification.status === 'skipped';

        return (
          <div key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  sent ? 'bg-green-100' : skipped ? 'bg-yellow-100' : 'bg-gray-100'
                }`}
              >
                <NotifIcon
                  className={`w-4 h-4 ${
                    sent ? 'text-green-700' : skipped ? 'text-yellow-700' : 'text-gray-500'
                  }`}
                />
              </div>
              {!isLast && <div className="w-px flex-1 bg-medium-brown/20 my-1" />}
            </div>
            <div className="pb-5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    sent
                      ? 'bg-green-100 text-green-800'
                      : skipped
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {sent ? 'Notified' : skipped ? 'Skipped' : notification.status}
                </span>
                <span className="text-xs text-medium-brown flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDateTime(notification.created_at)}
                </span>
              </div>
              <p className="text-sm text-dark-brown">{notificationLabel(notification)}</p>
              {notification.details && (
                <p className="text-xs text-medium-brown mt-0.5">{notification.details}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
