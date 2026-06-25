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
import ProductImage from './ProductImage';

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
      product_variants: product.product_variants.map((v) => ({
        id: v.id,
        size: v.size,
        price: v.price,
      })),
      apply_gst: applyGst,
      gst_rate: gstRate,
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
        className="group min-w-0"
      >
        <Link to={'/shop/' + product.slug} className="block min-w-0">
          <div className="relative aspect-square overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl border border-gold/15 bg-cream p-1.5 sm:p-2 md:p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-md hover:shadow-gold/15">
            <ProductImage
              blendBlack={false}
              src={product.image_url}
              alt={product.name}
              className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
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
      className="group h-full min-w-0"
    >
      <div className="relative h-full flex flex-col overflow-hidden rounded-lg md:rounded-2xl border border-gold/20 bg-gradient-to-b from-white to-cream/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-md hover:shadow-gold/15">
        <Link to={'/shop/' + product.slug} className="block shrink-0 min-w-0">
          <div className="relative aspect-square overflow-hidden bg-cream p-2 pb-1 md:p-4 md:pb-2">
            <ProductImage
              blendBlack={false}
              src={product.image_url}
              alt={product.name}
              className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
        </Link>

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={
            'absolute top-2 right-2 md:top-5 md:right-5 z-10 rounded-full p-1.5 md:p-2.5 backdrop-blur-md transition-all duration-300 ' +
            (isWishlisted
              ? 'bg-gold text-dark-brown shadow-md shadow-gold/30 scale-105'
              : 'bg-white/90 text-medium-brown shadow-sm hover:scale-110 hover:bg-gold hover:text-dark-brown hover:shadow-md hover:shadow-gold/25')
          }
        >
          <Heart className={'h-3 w-3 md:h-4 md:w-4 transition-transform duration-300 ' + (isWishlisted ? 'fill-current' : 'group-hover:scale-110')} />
        </button>

        {product.featured && (
          <span className="absolute top-2 left-2 md:top-5 md:left-5 z-10 inline-flex items-center gap-0.5 md:gap-1 rounded-full bg-gradient-to-r from-gold to-gold-dark px-1.5 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[11px] font-semibold uppercase tracking-wider text-dark-brown shadow-md shadow-gold/25">
            <Sparkles className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span className="hidden sm:inline">Bestseller</span>
            <span className="sm:hidden">Best</span>
          </span>
        )}

        <div className="flex flex-1 flex-col p-2 pt-1.5 md:p-4 md:pt-3 min-w-0">
          <div className="mb-1 md:mb-2 flex min-h-[28px] md:min-h-[40px] flex-wrap content-start gap-1 md:gap-1.5">
            {product.product_variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedSize(variant.size)}
                className={
                  'rounded-full border px-2 py-0.5 md:px-3.5 md:py-1.5 text-[10px] md:text-xs font-medium tracking-wide transition-all duration-200 ' +
                  (selectedSize === variant.size
                    ? 'border-gold bg-gold/15 text-dark-brown shadow-sm ring-1 ring-gold/50'
                    : 'border-medium-brown/25 bg-white/70 text-medium-brown hover:border-gold/50 hover:bg-cream hover:text-dark-brown')
                }
              >
                {variant.size}
              </button>
            ))}
          </div>

          <Link to={'/shop/' + product.slug} className="min-w-0">
            <h3 className="mb-1 md:mb-1.5 font-serif text-sm md:text-xl font-semibold leading-snug text-dark-brown transition-colors duration-200 group-hover:text-gold line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <StarRating rating={5} size="sm" className="mb-1 md:mb-1.5 scale-90 md:scale-100 origin-left" />
          <p className="mb-1.5 md:mb-2 line-clamp-2 min-h-[2rem] md:min-h-[2.25rem] text-xs md:text-sm leading-snug text-medium-brown/90">
            {product.short_description}
          </p>

          <div className={'mt-auto flex items-end gap-1.5 md:gap-3 border-t border-gold/15 pt-2 md:pt-3 min-w-0 ' + (hidePrice ? 'justify-end' : 'justify-between')}>
            {!hidePrice && (
              <div className="min-w-0 shrink">
                <span className="font-serif text-base md:text-2xl font-bold tracking-tight text-dark-brown">
                  {formatPrice(displayPrice)}
                </span>
                <span className="block min-h-3 md:min-h-4 text-[9px] md:text-[11px] font-medium uppercase tracking-wide text-medium-brown/80 truncate">
                  {gstLabel || '\u00A0'}
                </span>
              </div>
            )}
            <Button
              variant="gold"
              size="sm"
              onClick={handleAddToCart}
              className="shrink-0 rounded-full px-2 py-1 md:px-4 md:py-1.5 text-xs md:text-sm shadow-md shadow-gold/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/40"
            >
              <ShoppingCart className="mr-0.5 md:mr-1.5 h-3 w-3 md:h-4 md:w-4" />
              <span className="font-semibold">Add</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
