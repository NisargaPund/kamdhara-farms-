import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';
import { getProductBySlug } from '../lib/supabase';
import { getDisplayPrice, getGstLabel } from '../lib/gst';
import { formatPrice } from '../lib/utils';
import { useCartStore } from '../store/cart';
import type { Product, ProductVariant, Review } from '../types';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<(Product & { product_variants: ProductVariant[]; reviews: Review[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
        if (data?.product_variants[0]) {
          setSelectedSize(data.product_variants[0].size);
        }
        setSelectedImageIndex(0);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const selectedVariant = product?.product_variants.find(v => v.size === selectedSize);
  const applyGst = product?.apply_gst ?? false;
  const gstRate = product?.gst_rate ?? 5;
  const displayPrice = getDisplayPrice(selectedVariant?.price || 0, applyGst, gstRate);
  const gstLabel = getGstLabel(applyGst, gstRate);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addItem({
      product_id: product.id,
      variant_id: selectedVariant.id,
      product_name: product.name,
      product_slug: product.slug,
      size: selectedVariant.size,
      price: displayPrice,
      quantity,
      image_url: product.image_url,
    });
  };

  if (loading) {
    return (
      <div className="pt-24 pb-20 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-medium-brown">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-20 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl font-bold text-dark-brown mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button variant="primary">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = product.reviews?.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const images = [...new Set([product.image_url, ...(product.gallery_urls || [])].filter(Boolean))];
  const selectedImage = images[selectedImageIndex] || images[0] || '';

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border border-gold/20">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((url, index) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={
                      'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ' +
                      (selectedImageIndex === index
                        ? 'border-gold shadow-md ring-2 ring-gold/30'
                        : 'border-medium-brown/20 hover:border-gold/60 opacity-80 hover:opacity-100')
                    }
                  >
                    <img
                      src={url}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              {product.featured && (
                <span className="bg-gold text-dark-brown text-xs font-bold px-3 py-1 rounded-full">
                  Bestseller
                </span>
              )}
              <span className="text-medium-brown text-sm">{product.category}</span>
            </div>

            <h1 className="font-serif text-4xl font-bold text-dark-brown mb-4">{product.name}</h1>

            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={'w-5 h-5 ' + (
                      i < Math.floor(averageRating)
                        ? 'text-gold fill-gold'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-medium-brown">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            <p className="text-medium-brown mb-6">{product.description}</p>

            <div className="mb-6">
              <span className="text-sm font-medium text-dark-brown">Select Size:</span>
              <div className="flex space-x-3 mt-2">
                {product.product_variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedSize(variant.size)}
                    className={'px-4 py-2 rounded-lg border-2 font-medium transition-all ' + (
                      selectedSize === variant.size
                        ? 'border-gold bg-gold/10 text-dark-brown'
                        : 'border-medium-brown/30 text-dark-brown hover:border-gold'
                    )}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <span className="text-sm font-medium text-dark-brown">Quantity:</span>
              <div className="flex items-center space-x-3 mt-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg border border-medium-brown/30 hover:border-gold transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-lg border border-medium-brown/30 hover:border-gold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="font-serif text-3xl font-bold text-gold">
                  {formatPrice(displayPrice)}
                </span>
                {gstLabel && (
                  <span className="block text-sm text-medium-brown mt-1">{gstLabel}</span>
                )}
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={'p-3 rounded-full transition-all ' + (
                  isWishlisted
                    ? 'bg-gold text-dark-brown'
                    : 'bg-white hover:bg-gold/20 text-dark-brown'
                )}
              >
                <Heart className={'w-6 h-6 ' + (isWishlisted ? 'fill-current' : '')} />
              </button>
            </div>

            <Button
              variant="gold"
              size="lg"
              onClick={handleAddToCart}
              className="w-full"
            >
              Add to Cart
            </Button>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto text-gold mb-2" />
                <span className="text-xs text-medium-brown">Free shipping above 999</span>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto text-gold mb-2" />
                <span className="text-xs text-medium-brown">100% Authentic</span>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto text-gold mb-2" />
                <span className="text-xs text-medium-brown">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {product.benefits && product.benefits.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-dark-brown mb-6">Benefits</h2>
            <ul className="grid md:grid-cols-2 gap-3">
              {product.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <Star className="w-5 h-5 text-gold mt-0.5" />
                  <span className="text-medium-brown">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
