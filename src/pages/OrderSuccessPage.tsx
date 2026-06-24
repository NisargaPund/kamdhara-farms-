import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function OrderSuccessPage() {
  const location = useLocation();
  const orderNumber = (location.state as any)?.orderNumber || 'KF' + Date.now().toString().slice(-8);

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <div className="bg-gold/20 rounded-full p-4 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-gold" />
        </div>

        <h1 className="font-serif text-4xl font-bold text-dark-brown mb-4">
          Order Confirmed!
        </h1>

        <p className="text-medium-brown mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <Package className="w-5 h-5 text-gold" />
            <span className="text-sm text-medium-brown">Order Number</span>
          </div>
          <p className="font-serif text-2xl font-bold text-dark-brown mt-2">{orderNumber}</p>
        </div>

        <p className="text-sm text-medium-brown mb-6">
          You will receive an SMS confirmation shortly with tracking details.
        </p>

        <div className="space-y-3">
          <Link to="/shop">
            <Button variant="gold" size="lg" className="w-full">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
