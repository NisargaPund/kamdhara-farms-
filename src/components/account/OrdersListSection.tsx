import { useEffect, useState } from 'react';
import { Package, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import { getUserOrders, splitOrders } from '../../lib/userOrders';
import { formatOrderStatus, statusBadgeColors } from '../../lib/orderStatus';
import { formatPrice } from '../../lib/utils';
import type { Order } from '../../types';
import OrderStatusStepper from './OrderStatusStepper';
import OrderDetailModal from './OrderDetailModal';
import Button from '../ui/Button';

interface OrdersListSectionProps {
  mode: 'current' | 'history';
  highlightOrderNumber?: string | null;
}

export default function OrdersListSection({ mode, highlightOrderNumber }: OrdersListSectionProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserOrders(user.id)
      .then((all) => {
        const { current, history } = splitOrders(all);
        const list = mode === 'current' ? current : history;
        setOrders(list);
        if (highlightOrderNumber) {
          const match = list.find((o) => o.order_number === highlightOrderNumber);
          if (match) setSelectedOrder(match);
        }
      })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [user, mode, highlightOrderNumber]);

  const title = mode === 'current' ? 'Current Orders' : 'Order History';
  const subtitle =
    mode === 'current'
      ? 'Track your active orders in real time'
      : 'View your completed and past orders';

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-dark-brown">{title}</h2>
        <p className="text-sm text-medium-brown mt-1">{subtitle}</p>
      </div>

      {loading ? (
        <p className="text-medium-brown">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-cream/50 rounded-xl">
          <Package className="w-12 h-12 mx-auto text-medium-brown mb-3" />
          <p className="text-medium-brown">
            {mode === 'current' ? 'No active orders' : 'No past orders yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`bg-cream/50 rounded-xl p-5 border border-medium-brown/10 ${
                highlightOrderNumber === order.order_number ? 'ring-2 ring-gold/40' : ''
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-semibold text-dark-brown">{order.order_number}</p>
                  <p className="text-xs text-medium-brown mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      statusBadgeColors[order.status] || 'bg-gray-100'
                    }`}
                  >
                    {formatOrderStatus(order.status)}
                  </span>
                  <span className="font-bold text-gold">{formatPrice(order.total)}</span>
                </div>
              </div>

              {mode === 'current' && order.status !== 'cancelled' && (
                <OrderStatusStepper status={order.status} compact />
              )}

              <div className="mt-3 pt-3 border-t border-medium-brown/10 flex items-center justify-between">
                <p className="text-sm text-medium-brown">
                  {order.order_items?.length || 0} item
                  {(order.order_items?.length || 0) !== 1 ? 's' : ''}
                  {order.tracking_number && (
                    <span className="ml-2 font-mono text-xs">#{order.tracking_number}</span>
                  )}
                </p>
                <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(order)}>
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
