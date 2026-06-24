import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../lib/auth';
import { useWishlistStore } from '../lib/wishlist';
import { formatPrice } from '../lib/utils';

export default function WishlistPage() {
  const { user } = useAuth();
  const { items, loading, fetchWishlist, removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    if (user) {
      fetchWishlist(user.id);
    }
  }, [user, fetchWishlist]);

  if (!user) {
    return (
      <div className="pt-24 pb-20 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Heart className="w-20 h-20 mx-auto text-medium-brown mb-4" />
          <h1 className="font-serif text-3xl font-bold text-dark-brown mb-4">
            Your Wishlist
          </h1>
          <p className="text-medium-brown mb-8">
            Please sign in to view your wishlist.
          </p>
          <Link to="/login">
            <Button variant="gold">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-24 pb-20 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-medium-brown">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-20 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Heart className="w-20 h-20 mx-auto text-medium-brown mb-4" />
          <h1 className="font-serif text-3xl font-bold text-dark-brown mb-4">
            Your Wishlist is Empty
          </h1>
          <p className="text-medium-brown mb-8">
            Save your favorite products for later.
          </p>
          <Link to="/shop">
            <Button variant="gold">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl font-bold text-dark-brown mb-8 text-center"
        >
          My Wishlist
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <Link to={'/shop/' + item.product_slug}>
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="p-4">
                <Link to={'/shop/' + item.product_slug}>
                  <h3 className="font-serif text-lg font-semibold text-dark-brown hover:text-gold transition-colors">
                    {item.product_name}
                  </h3>
                </Link>
                <p className="text-gold font-bold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-4">
                  <Link to={'/shop/' + item.product_slug}>
                    <Button variant="gold" size="sm">
                      View Product
                    </Button>
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(user.id, item.product_id)}
                    className="p-2 text-medium-brown hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
