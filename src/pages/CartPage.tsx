import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { useCartStore } from '../store/cart';
import { formatPrice } from '../lib/utils';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-20 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <ShoppingBag className="w-20 h-20 mx-auto text-medium-brown mb-4" />
          <h1 className="font-serif text-3xl font-bold text-dark-brown mb-4">Your Cart is Empty</h1>
          <p className="text-medium-brown mb-8">Add some delicious ghee to your cart!</p>
          <Link to="/shop">
            <Button variant="gold">Shop Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl font-bold text-dark-brown mb-8"
        >
          Shopping Cart
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
              >
                <Link to={'/shop/' + item.product_slug}>
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1">
                  <Link to={'/shop/' + item.product_slug}>
                    <h3 className="font-semibold text-dark-brown hover:text-gold transition-colors">
                      {item.product_name}
                    </h3>
                  </Link>
                  <p className="text-sm text-medium-brown">{item.size}</p>
                  <p className="text-gold font-semibold mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.variant_id, Math.max(1, item.quantity - 1))}
                      className="p-1 rounded border border-medium-brown/30 hover:border-gold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                      className="p-1 rounded border border-medium-brown/30 hover:border-gold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-dark-brown">{formatPrice(item.price * item.quantity)}</p>
                  <button
                    onClick={() => removeItem(item.variant_id)}
                    className="mt-2 text-medium-brown hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-medium-brown">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium-brown">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                {subtotal < 999 && (
                  <p className="text-sm text-gold">Add {formatPrice(999 - subtotal)} more for free shipping!</p>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-dark-brown">Total</span>
                  <span className="font-bold text-dark-brown text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button variant="gold" size="lg" className="w-full">
                  Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link to="/shop" className="block text-center mt-4 text-medium-brown hover:text-gold transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
