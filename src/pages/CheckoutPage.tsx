import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Smartphone, Truck } from 'lucide-react';
import Button from '../components/ui/Button';
import { useCartStore } from '../store/cart';
import { useAuth } from '../lib/auth';
import { formatSupabaseError } from '../lib/supabase';
import { createStoreOrder, markOrderPaymentFailed } from '../lib/orders';
import { sendOrderNotification } from '../lib/notifications';
import { initiateRazorpayPayment, verifyRazorpayPayment, RAZORPAY_SETUP_HINT } from '../lib/razorpay';
import { formatPrice } from '../lib/utils';
import toast from 'react-hot-toast';
import type { Address } from '../types';

type OnlinePaymentMethod = 'upi' | 'card';

const PAYMENT_METHODS: {
  id: OnlinePaymentMethod;
  icon: typeof Smartphone;
  label: string;
  desc: string;
}[] = [
  { id: 'upi', icon: Smartphone, label: 'UPI', desc: 'Google Pay, PhonePe, Paytm — pay securely via Razorpay' },
  { id: 'card', icon: CreditCard, label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay — powered by Razorpay' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<OnlinePaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const validateStep1 = () => {
    if (!address.full_name.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!address.phone.trim() || address.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    if (!address.address_line1.trim()) {
      toast.error('Please enter your address');
      return false;
    }
    if (!address.city.trim() || !address.state.trim() || !address.pincode.trim()) {
      toast.error('Please fill city, state, and pincode');
      return false;
    }
    return true;
  };

  const completeOrder = (orderNumber: string, orderId: string) => {
    clearCart();
    navigate('/order-success', {
      state: { orderNumber, orderId },
    });
  };

  const handlePlaceOrder = async () => {
    if (!validateStep1()) return;

    setIsProcessing(true);

    let orderId: string | null = null;

    try {
      const order = await createStoreOrder({
        userId: user?.id || null,
        paymentMethod,
        subtotal,
        shipping,
        total,
        address,
        items,
      });
      orderId = order.id;

      const paymentResponse = await initiateRazorpayPayment({
        storeOrderId: order.id,
        amountInPaise: Math.round(total * 100),
        paymentMethod,
        customer: {
          name: address.full_name,
          email: user?.email,
          phone: address.phone,
        },
      });

      await verifyRazorpayPayment(order.id, paymentResponse);
      sendOrderNotification({ orderId: order.id, type: 'order_placed' });
      toast.success('Payment successful!');
      completeOrder(order.order_number, order.id);
    } catch (error) {
      const message = formatSupabaseError(error);
      console.error('Order error:', message, error);
      if (message === 'Payment cancelled') {
        if (orderId) {
          await markOrderPaymentFailed(orderId);
        }
        toast.error('Payment was cancelled. Please try again to complete your order.');
      } else {
        if (orderId) {
          await markOrderPaymentFailed(orderId);
        }
        toast.error(message, { duration: 8000 });
        if (
          !message.toLowerCase().includes('secret') &&
          (message.includes('Payment server not ready') || message.toLowerCase().includes('edge function'))
        ) {
          toast(RAZORPAY_SETUP_HINT, { duration: 10000, icon: 'ℹ️' });
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl font-bold text-dark-brown mb-8 text-center"
        >
          Checkout
        </motion.h1>

        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={'w-10 h-10 rounded-full flex items-center justify-center font-bold ' + (
                step >= s
                  ? 'bg-gold text-dark-brown'
                  : 'bg-white text-medium-brown'
              )}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={'w-16 h-1 ' + (step > s ? 'bg-gold' : 'bg-white')} />
              )}
            </div>
          ))}
        </div>

        {!user && (
          <div className="bg-gold/10 border border-gold rounded-lg p-4 mb-6 text-center">
            <p className="text-dark-brown">
              <Link to="/login" className="font-semibold hover:underline">Sign in</Link> for faster checkout and order tracking
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          {step === 1 && (
            <div>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Shipping Address
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={address.full_name}
                    onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-dark-brown mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    value={address.address_line1}
                    onChange={(e) => setAddress({ ...address, address_line1: e.target.value })}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                    placeholder="House/Flat No., Building Name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-dark-brown mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={address.address_line2}
                    onChange={(e) => setAddress({ ...address, address_line2: e.target.value })}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                    placeholder="Street, Locality"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>
              <Button
                variant="gold"
                size="lg"
                onClick={() => validateStep1() && setStep(2)}
                className="w-full mt-6"
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-4">
                Payment Method
              </h2>
              <p className="text-sm text-medium-brown mb-4">
                All orders are prepaid. Pay securely online via Razorpay before your order is confirmed.
              </p>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={'w-full p-4 rounded-lg border-2 text-left flex items-center transition-all ' + (
                      paymentMethod === method.id
                        ? 'border-gold bg-gold/10'
                        : 'border-medium-brown/30 hover:border-gold'
                    )}
                  >
                    <method.icon className="w-6 h-6 mr-3 text-gold" />
                    <div>
                      <p className="font-semibold text-dark-brown">{method.label}</p>
                      <p className="text-sm text-medium-brown">{method.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button variant="gold" size="lg" onClick={() => setStep(3)} className="flex-1">
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-4">Review Order</h2>

              <div className="border-b pb-4 mb-4">
                <h3 className="font-semibold text-dark-brown mb-2">Shipping Address</h3>
                <p className="text-medium-brown">
                  {address.full_name}<br />
                  {address.address_line1}<br />
                  {address.address_line2 && <>{address.address_line2}<br /></>}
                  {address.city}, {address.state} - {address.pincode}<br />
                  Phone: {address.phone}
                </p>
              </div>

              <div className="border-b pb-4 mb-4">
                <h3 className="font-semibold text-dark-brown mb-2">Payment Method</h3>
                <p className="text-medium-brown">
                  {paymentMethod === 'upi' ? 'UPI (Razorpay)' : 'Credit/Debit Card (Razorpay)'}
                </p>
              </div>

              <div className="border-b pb-4 mb-4">
                <h3 className="font-semibold text-dark-brown mb-2">Order Items</h3>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <img src={item.image_url} alt={item.product_name} className="w-12 h-12 object-cover rounded" />
                      <span className="text-medium-brown">
                        {item.product_name} ({item.size}) x {item.quantity}
                      </span>
                    </div>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-medium-brown">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium-brown">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-dark-brown pt-2 border-t">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>

              <p className="text-sm text-medium-brown mb-4 bg-cream rounded-lg p-3">
                You will be redirected to Razorpay secure checkout to complete your {paymentMethod === 'upi' ? 'UPI' : 'card'} payment. Your order is confirmed only after successful payment.
              </p>

              <div className="flex gap-4">
                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handlePlaceOrder}
                  isLoading={isProcessing}
                  className="flex-1"
                >
                  Pay {formatPrice(total)}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
