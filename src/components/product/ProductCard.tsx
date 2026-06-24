import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { getDisplayPrice, getGstLabel } from '../../lib/gst';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cart';
import { useAuth } from '../../lib/auth';
import { useWishlistStore } from '../../lib/wishlist';
import toast from 'react-hot-toast';
import type { Product, ProductVariant } from '../../types';

interface ProductCardProps {
  product: Product & { product_variants: ProductVariant[] };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(product.product_variants[0]?.size || '500ml');
  const addItem = useCartStore((state) => state.addItem);

  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);
  const selectedVariant = product.product_variants.find(v => v.size === selectedSize) || product.product_variants[0];
  const applyGst = product.apply_gst ?? false;
  const gstRate = product.gst_rate ?? 5;
  const displayPrice = getDisplayPrice(selectedVariant?.price || 0, applyGst, gstRate);
  const gstLabel = getGstLabel(applyGst, gstRate);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      product_id: product.id,
      variant_id: selectedVariant.id,
      product_name: product.name,
      product_slug: product.slug,
      size: selectedVariant.size,
      price: displayPrice,
      quantity: 1,
      image_url: product.image_url,
    });
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please sign in to add to wishlist');
      return;
    }

    if (isWishlisted) {
      await removeFromWishlist(user.id, product.id);
      toast.success('Removed from wishlist');
    } else {
      await addToWishlist(user.id, {
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        image_url: product.image_url,
        price: selectedVariant?.price || 0,
      });
      toast.success('Added to wishlist!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <Link to={'/shop/' + product.slug}>
          <div className="aspect-square overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>

        <button
          onClick={handleWishlistToggle}
          className={'absolute top-3 right-3 p-2 rounded-full transition-colors ' + (
            isWishlisted
              ? 'bg-gold text-dark-brown'
              : 'bg-white/80 text-dark-brown hover:bg-gold hover:text-dark-brown'
          )}
        >
          <Heart className={'w-5 h-5 ' + (isWishlisted ? 'fill-current' : '')} />
        </button>

        {product.featured && (
          <span className="absolute top-3 left-3 bg-gold text-dark-brown text-xs font-bold px-3 py-1 rounded-full">
            Bestseller
          </span>
        )}

        <div className="p-4">
          <div className="flex space-x-2 mb-3">
            {product.product_variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedSize(variant.size)}
                className={'px-3 py-1 text-sm rounded-full border transition-colors ' + (
                  selectedSize === variant.size
                    ? 'bg-dark-brown text-white border-dark-brown'
                    : 'border-medium-brown text-dark-brown hover:border-dark-brown'
                )}
              >
                {variant.size}
              </button>
            ))}
          </div>

          <Link to={'/shop/' + product.slug}>
            <h3 className="font-serif text-lg font-semibold text-dark-brown mb-1 hover:text-gold transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-medium-brown mb-2 line-clamp-2">{product.short_description}</p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gold">{formatPrice(displayPrice)}</span>
              {gstLabel && (
                <span className="block text-xs text-medium-brown">{gstLabel}</span>
              )}
            </div>
            <Button
              variant="gold"
              size="sm"
              onClick={handleAddToCart}
              className="flex items-center space-x-1"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
