import { useEffect, useState } from 'react';
import { Eye, X, Truck, User, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminOrderDetail, getAdminOrders, updateOrderStatus } from '../../lib/admin';
import { formatSupabaseError } from '../../lib/supabase';
import { ALL_ORDER_STATUSES, formatOrderStatus, statusBadgeColors } from '../../lib/orderStatus';
import { formatPrice } from '../../lib/utils';
import { formatBottleLabel } from '../../lib/variants';
import Button from '../../components/ui/Button';
import OrderStatusStepper from '../../components/account/OrderStatusStepper';
import OrderActivityTimeline from '../components/OrderActivityTimeline';
import type { AdminOrderDetail, Order } from '../../types';

const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

function getAdminActionError(error: unknown, fallback: string): string {
  const message = formatSupabaseError(error);
  return message || fallback;
}

function showAdminActionError(error: unknown, fallback: string) {
  const message = getAdminActionError(error, fallback);
  toast.error(message, { duration: 8000 });
  if (message.toLowerCase().includes('column')) {
    toast('Run supabase/fix_missing_order_columns.sql in the Supabase SQL Editor', {
      duration: 10000,
      icon: 'ℹ️',
    });
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    tracking_number: '',
    carrier: 'Kamdhara Farms Delivery',
    estimated_delivery: '',
  });
  const [orderDetail, setOrderDetail] = useState<AdminOrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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
    void loadOrders();
  }, []);

  const loadOrderDetail = async (orderId: string) => {
    setDetailLoading(true);
    try {
      setOrderDetail(await getAdminOrderDetail(orderId));
    } catch {
      toast.error('Failed to load order activity');
      setOrderDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const openOrder = (order: Order) => {
    setSelectedOrder(order);
    setTrackingForm({
      tracking_number: order.tracking_number || '',
      carrier: order.carrier || 'Kamdhara Farms Delivery',
      estimated_delivery: order.estimated_delivery?.split('T')[0] || '',
    });
    void loadOrderDetail(order.id);
  };

  const closeOrder = () => {
    setSelectedOrder(null);
    setOrderDetail(null);
  };

  const filtered =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    if (selectedOrder?.id === orderId && selectedOrder.status === status) {
      return;
    }

    setUpdating(true);
    try {
      await updateOrderStatus(orderId, status);
      toast.success('Order status updated — customer notified');
      await loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((o) => (o ? { ...o, status } : null));
        await loadOrderDetail(orderId);
      }
    } catch (error) {
      showAdminActionError(error, 'Failed to update status');
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
        await loadOrderDetail(orderId);
      }
    } catch (error) {
      showAdminActionError(error, 'Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveTracking = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await updateOrderStatus(selectedOrder.id, selectedOrder.status, undefined, {
        tracking_number: trackingForm.tracking_number,
        carrier: trackingForm.carrier,
        estimated_delivery: trackingForm.estimated_delivery || undefined,
      });
      toast.success('Tracking info saved');
      await loadOrders();
      setSelectedOrder((o) =>
        o
          ? {
              ...o,
              tracking_number: trackingForm.tracking_number || null,
              carrier: trackingForm.carrier || null,
              estimated_delivery: trackingForm.estimated_delivery || null,
            }
          : null
      );
      if (selectedOrder) {
        await loadOrderDetail(selectedOrder.id);
      }
    } catch (error) {
      showAdminActionError(error, 'Failed to save tracking info');
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
        {['all', ...ALL_ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-gold text-dark-brown'
                : 'bg-white text-medium-brown hover:bg-gold/20'
            }`}
          >
            {s === 'all' ? 'All' : formatOrderStatus(s)}{' '}
            {s !== 'all' && `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-medium-brown">Loading orders...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
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
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openOrder(order)}
                        className="font-medium text-dark-brown hover:text-gold underline-offset-2 hover:underline"
                      >
                        {order.order_number}
                      </button>
                    </td>
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
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusBadgeColors[order.status] || 'bg-gray-100'
                        }`}
                      >
                        {formatOrderStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-medium-brown">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openOrder(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="text-center py-12 text-medium-brown">No orders found</p>
          )}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-serif text-xl font-bold text-dark-brown">
                  Order {selectedOrder.order_number}
                </h2>
                <p className="text-xs text-medium-brown mt-0.5">
                  Placed {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                </p>
              </div>
              <button onClick={closeOrder} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-cream/30 rounded-lg px-4 border border-gold/10">
                <OrderStatusStepper
                  status={selectedOrder.status}
                  interactive
                  disabled={updating}
                  onStatusSelect={(status) => handleStatusUpdate(selectedOrder.id, status)}
                />
              </div>

              {(orderDetail?.customer || selectedOrder.shipping_address) && (
                <div className="bg-cream/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-gold" />
                    <h3 className="font-semibold text-dark-brown">Customer</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-dark-brown font-medium">
                        {orderDetail?.customer?.full_name ||
                          selectedOrder.shipping_address?.full_name ||
                          'Guest'}
                      </p>
                      {orderDetail?.customer?.email && (
                        <p className="text-medium-brown">{orderDetail.customer.email}</p>
                      )}
                      <p className="text-medium-brown">
                        {orderDetail?.customer?.phone || selectedOrder.shipping_address?.phone}
                      </p>
                    </div>
                    {orderDetail?.customer && (
                      <div className="text-medium-brown">
                        <p>
                          Notifications:{' '}
                          {orderDetail.customer.email_notifications !== false ? 'Email' : ''}
                          {orderDetail.customer.email_notifications !== false &&
                          orderDetail.customer.whatsapp_notifications !== false
                            ? ' · '
                            : ''}
                          {orderDetail.customer.whatsapp_notifications !== false
                            ? 'WhatsApp'
                            : ''}
                        </p>
                        <p className="text-xs mt-1">
                          Member since{' '}
                          {new Date(orderDetail.customer.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-dark-brown mb-2">Shipping Address</h3>
                  <p className="text-medium-brown text-sm">
                    {selectedOrder.shipping_address?.full_name}
                    <br />
                    {selectedOrder.shipping_address?.address_line1}
                    <br />
                    {selectedOrder.shipping_address?.address_line2 && (
                      <>{selectedOrder.shipping_address.address_line2}<br /></>
                    )}
                    {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} -{' '}
                    {selectedOrder.shipping_address?.pincode}
                    <br />
                    Phone: {selectedOrder.shipping_address?.phone}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-dark-brown mb-2">Order Summary</h3>
                  <p className="text-sm text-medium-brown">Subtotal: {formatPrice(selectedOrder.subtotal)}</p>
                  <p className="text-sm text-medium-brown">
                    Shipping:{' '}
                    {selectedOrder.shipping_cost === 0
                      ? 'Free'
                      : formatPrice(selectedOrder.shipping_cost)}
                  </p>
                  <p className="text-lg font-bold text-gold mt-1">
                    Total: {formatPrice(selectedOrder.total)}
                  </p>
                  <p className="text-sm text-medium-brown mt-2 capitalize">
                    Payment: {selectedOrder.payment_method} ({selectedOrder.payment_status})
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-dark-brown mb-2">Items</h3>
                {selectedOrder.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-medium-brown">
                      {item.product_name} — {formatBottleLabel(item.quantity, item.size)}
                    </span>
                    <span className="font-medium">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-cream/50 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold" />
                  <h3 className="font-semibold text-dark-brown">Tracking & Delivery</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-dark-brown mb-1">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingForm.tracking_number}
                      onChange={(e) =>
                        setTrackingForm({ ...trackingForm, tracking_number: e.target.value })
                      }
                      className="w-full p-2.5 border border-medium-brown/30 rounded-lg text-sm focus:outline-none focus:border-gold"
                      placeholder="KF-12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dark-brown mb-1">Carrier</label>
                    <input
                      type="text"
                      value={trackingForm.carrier}
                      onChange={(e) => setTrackingForm({ ...trackingForm, carrier: e.target.value })}
                      className="w-full p-2.5 border border-medium-brown/30 rounded-lg text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dark-brown mb-1">
                      Estimated Delivery
                    </label>
                    <input
                      type="date"
                      value={trackingForm.estimated_delivery}
                      onChange={(e) =>
                        setTrackingForm({ ...trackingForm, estimated_delivery: e.target.value })
                      }
                      className="w-full p-2.5 border border-medium-brown/30 rounded-lg text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={handleSaveTracking} isLoading={updating}>
                  Save Tracking Info
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-2">Order Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                    disabled={updating}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                  >
                    {ALL_ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {formatOrderStatus(s)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-medium-brown mt-1">
                    Customer is notified automatically on status changes
                  </p>
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
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border border-gold/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-4 h-4 text-gold" />
                  <h3 className="font-semibold text-dark-brown">Order Activity</h3>
                </div>
                <p className="text-xs text-medium-brown mb-4">
                  All status changes, tracking updates, and customer notifications for this order
                </p>
                <OrderActivityTimeline
                  history={orderDetail?.history || []}
                  notifications={orderDetail?.notifications || []}
                  loading={detailLoading}
                />
              </div>

              <Button variant="secondary" onClick={closeOrder} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
