import { X, Package, MapPin, CreditCard, Truck } from 'lucide-react';
import type { Order } from '../../types';
import { formatPrice } from '../../lib/utils';
import { formatOrderStatus, statusBadgeColors } from '../../lib/orderStatus';
import OrderStatusStepper from './OrderStatusStepper';
import Button from '../ui/Button';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const addr = order.shipping_address;
  const estDelivery = order.estimated_delivery
    ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-serif text-xl font-bold text-dark-brown">
              Order {order.order_number}
            </h2>
            <p className="text-sm text-medium-brown">
              Placed {new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                statusBadgeColors[order.status] || 'bg-gray-100'
              }`}
            >
              {formatOrderStatus(order.status)}
            </span>
            <span className="text-lg font-bold text-gold">{formatPrice(order.total)}</span>
          </div>

          <OrderStatusStepper status={order.status} />

          {(order.tracking_number || estDelivery) && (
            <div className="bg-cream rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-dark-brown font-semibold">
                <Truck className="w-4 h-4 text-gold" />
                Tracking Information
              </div>
              {order.tracking_number && (
                <p className="text-sm text-medium-brown">
                  Tracking #: <span className="font-mono text-dark-brown">{order.tracking_number}</span>
                </p>
              )}
              {order.carrier && (
                <p className="text-sm text-medium-brown">Carrier: {order.carrier}</p>
              )}
              {estDelivery && (
                <p className="text-sm text-medium-brown">Estimated delivery: {estDelivery}</p>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-gold" />
              <h3 className="font-semibold text-dark-brown">Items</h3>
            </div>
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-dark-brown font-medium">{item.product_name}</p>
                  <p className="text-sm text-medium-brown">
                    {item.size} × {item.quantity}
                  </p>
                </div>
                <span className="font-medium text-dark-brown">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-cream/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gold" />
                <h3 className="font-semibold text-dark-brown text-sm">Shipping Address</h3>
              </div>
              <p className="text-sm text-medium-brown leading-relaxed">
                {addr?.full_name}<br />
                {addr?.address_line1}<br />
                {addr?.address_line2 && <>{addr.address_line2}<br /></>}
                {addr?.city}, {addr?.state} - {addr?.pincode}<br />
                {addr?.phone}
              </p>
            </div>
            <div className="bg-cream/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-gold" />
                <h3 className="font-semibold text-dark-brown text-sm">Payment</h3>
              </div>
              <p className="text-sm text-medium-brown capitalize">
                Method: {order.payment_method}
              </p>
              <p className="text-sm text-medium-brown capitalize">
                Status: {order.payment_status}
              </p>
              <div className="mt-3 pt-3 border-t border-medium-brown/10 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-medium-brown">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium-brown">Shipping</span>
                  <span>
                    {order.shipping_cost === 0 ? 'Free' : formatPrice(order.shipping_cost)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-dark-brown">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
