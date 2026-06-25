import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import StarRating from '../ui/StarRating';
import { getDisplayPrice, getGstLabel } from '../../lib/gst';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cart';
import { useAuth } from '../../lib/auth';
import { useWishlistStore } from '../../lib/wishlist';
import toast from 'react-hot-toast';
import type { Product, ProductVariant } from '../../types';

interface ProductCardProps {
  product: Product & { product_variants: ProductVariant[]; reviews?: { rating: number }[] };
  hidePrice?: boolean;
  imageOnly?: boolean;
}

export default function ProductCard({ product, hidePrice = false, imageOnly = false }: ProductCardProps) {
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

  if (imageOnly) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group"
      >
        <Link to={'/shop/' + product.slug} className="block">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream p-2 shadow-[0_4px_24px_-4px_rgba(62,43,31,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-8px_rgba(200,167,106,0.35)]">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-brown/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-farm-green/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group h-full"
    >
      <div className="relative h-full flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-b from-white to-cream/60 shadow-[0_4px_24px_-4px_rgba(62,43,31,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_16px_40px_-8px_rgba(200,167,106,0.35)]">
        <Link to={'/shop/' + product.slug} className="block shrink-0">
          <div className="relative aspect-square overflow-hidden bg-cream p-2 pb-0">
            <div className="relative h-full w-full overflow-hidden rounded-t-xl rounded-b-md">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-brown/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-farm-green/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={
            'absolute top-5 right-5 z-10 rounded-full p-2.5 backdrop-blur-md transition-all duration-300 ' +
            (isWishlisted
              ? 'bg-gold text-dark-brown shadow-md shadow-gold/30 scale-105'
              : 'bg-white/90 text-medium-brown shadow-sm hover:scale-110 hover:bg-gold hover:text-dark-brown hover:shadow-md hover:shadow-gold/25')
          }
        >
          <Heart className={'h-4 w-4 transition-transform duration-300 ' + (isWishlisted ? 'fill-current' : 'group-hover:scale-110')} />
        </button>

        {product.featured && (
          <span className="absolute top-5 left-5 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold to-gold-dark px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-dark-brown shadow-md shadow-gold/25">
            <Sparkles className="h-3 w-3" />
            Bestseller
          </span>
        )}

        <div className="flex flex-1 flex-col p-4 pt-3">
          <div className="mb-2 flex min-h-[40px] flex-wrap content-start gap-1.5">
            {product.product_variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedSize(variant.size)}
                className={
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all duration-200 ' +
                  (selectedSize === variant.size
                    ? 'border-gold bg-gold/15 text-dark-brown shadow-sm ring-1 ring-gold/50'
                    : 'border-medium-brown/25 bg-white/70 text-medium-brown hover:border-gold/50 hover:bg-cream hover:text-dark-brown')
                }
              >
                {variant.size}
              </button>
            ))}
          </div>

          <Link to={'/shop/' + product.slug}>
            <h3 className="mb-1.5 font-serif text-xl font-semibold leading-snug text-dark-brown transition-colors duration-200 group-hover:text-gold">
              {product.name}
            </h3>
          </Link>
          <StarRating rating={5} size="sm" className="mb-1.5" />
          <p className="mb-2 line-clamp-2 min-h-[2.25rem] text-sm leading-snug text-medium-brown/90">
            {product.short_description}
          </p>

          <div className={'mt-auto flex items-end gap-3 border-t border-gold/15 pt-3 ' + (hidePrice ? 'justify-end' : 'justify-between')}>
            {!hidePrice && (
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-dark-brown">
                  {formatPrice(displayPrice)}
                </span>
                <span className="block min-h-4 text-[11px] font-medium uppercase tracking-wide text-medium-brown/80">
                  {gstLabel || '\u00A0'}
                </span>
              </div>
            )}
            <Button
              variant="gold"
              size="sm"
              onClick={handleAddToCart}
              className="rounded-full px-4 shadow-md shadow-gold/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/40"
            >
              <ShoppingCart className="mr-1.5 h-4 w-4" />
              <span className="font-semibold">Add</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
