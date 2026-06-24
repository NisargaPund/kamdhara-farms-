import { useEffect, useState } from 'react';
import { Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminOrders, updateOrderStatus } from '../../lib/admin';
import { formatPrice } from '../../lib/utils';
import Button from '../../components/ui/Button';
import type { Order } from '../../types';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadOrders = async () => {
    try {
      setOrders(await getAdminOrders());
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      await loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((o) => (o ? { ...o, status } : null));
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentUpdate = async (orderId: string, paymentStatus: string) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, selectedOrder?.status || 'pending', paymentStatus);
      toast.success('Payment status updated');
      await loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((o) => (o ? { ...o, payment_status: paymentStatus } : null));
      }
    } catch {
      toast.error('Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-dark-brown">Orders</h1>
        <p className="text-medium-brown mt-1">Manage customer orders and fulfillment</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === s
                ? 'bg-gold text-dark-brown'
                : 'bg-white text-medium-brown hover:bg-gold/20'
            }`}
          >
            {s} {s !== 'all' && `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-medium-brown">Loading orders...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-medium-brown border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Order #</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Payment</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-dark-brown">{order.order_number}</td>
                  <td className="px-6 py-4">
                    <p className="text-dark-brown">{order.shipping_address?.full_name || 'Guest'}</p>
                    <p className="text-xs text-medium-brown">{order.shipping_address?.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-medium-brown">
                    {order.order_items?.length || 0} items
                  </td>
                  <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs capitalize">{order.payment_method}</span>
                    <br />
                    <span className="text-xs text-medium-brown">{order.payment_status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        statusColors[order.status] || 'bg-gray-100'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-medium-brown">
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-12 text-medium-brown">No orders found</p>
          )}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-dark-brown">
                Order {selectedOrder.order_number}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-dark-brown mb-2">Shipping Address</h3>
                  <p className="text-medium-brown text-sm">
                    {selectedOrder.shipping_address?.full_name}<br />
                    {selectedOrder.shipping_address?.address_line1}<br />
                    {selectedOrder.shipping_address?.address_line2 && (
                      <>{selectedOrder.shipping_address.address_line2}<br /></>
                    )}
                    {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} -{' '}
                    {selectedOrder.shipping_address?.pincode}<br />
                    Phone: {selectedOrder.shipping_address?.phone}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-dark-brown mb-2">Order Summary</h3>
                  <p className="text-sm text-medium-brown">Subtotal: {formatPrice(selectedOrder.subtotal)}</p>
                  <p className="text-sm text-medium-brown">
                    Shipping: {selectedOrder.shipping_cost === 0 ? 'Free' : formatPrice(selectedOrder.shipping_cost)}
                  </p>
                  <p className="text-lg font-bold text-gold mt-1">
                    Total: {formatPrice(selectedOrder.total)}
                  </p>
                  <p className="text-sm text-medium-brown mt-2 capitalize">
                    Payment: {selectedOrder.payment_method} ({selectedOrder.payment_status})
                  </p>
                  {selectedOrder.razorpay_payment_id && (
                    <p className="text-xs text-medium-brown mt-1">
                      Razorpay ID: {selectedOrder.razorpay_payment_id}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-dark-brown mb-2">Items</h3>
                {selectedOrder.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-medium-brown">
                      {item.product_name} ({item.size}) x {item.quantity}
                    </span>
                    <span className="font-medium">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-2">Order Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                    disabled={updating}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold capitalize"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-2">Payment Status</label>
                  <select
                    value={selectedOrder.payment_status}
                    onChange={(e) => handlePaymentUpdate(selectedOrder.id, e.target.value)}
                    disabled={updating}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold capitalize"
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button variant="secondary" onClick={() => setSelectedOrder(null)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
