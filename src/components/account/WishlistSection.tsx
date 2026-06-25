import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useWishlistStore } from '../../lib/wishlist';
import { formatPrice } from '../../lib/utils';
import Button from '../ui/Button';

export default function WishlistSection() {
  const { user } = useAuth();
  const { items, loading, fetchWishlist, removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    if (user) fetchWishlist(user.id);
  }, [user, fetchWishlist]);

  if (loading) {
    return <p className="text-medium-brown">Loading wishlist...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-dark-brown">Wishlist</h2>
        <p className="text-sm text-medium-brown mt-1">Products you have saved for later</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-cream/50 rounded-xl">
          <Heart className="w-12 h-12 mx-auto text-medium-brown mb-3" />
          <p className="text-medium-brown mb-4">Your wishlist is empty</p>
          <Link to="/shop">
            <Button variant="gold" size="sm">
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex">
              <Link to={`/shop/${item.product_slug}`} className="shrink-0">
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="w-24 h-24 object-cover"
                />
              </Link>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/shop/${item.product_slug}`}>
                    <h3 className="font-serif font-semibold text-dark-brown hover:text-gold transition-colors line-clamp-2">
                      {item.product_name}
                    </h3>
                  </Link>
                  <p className="text-gold font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Link to={`/shop/${item.product_slug}`}>
                    <Button variant="gold" size="sm">
                      View
                    </Button>
                  </Link>
                  {user && (
                    <button
                      onClick={() => removeFromWishlist(user.id, item.product_id)}
                      className="p-2 text-medium-brown hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
