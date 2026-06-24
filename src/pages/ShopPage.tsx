import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import { getProducts } from '../lib/supabase';
import type { Product, ProductVariant } from '../types';

const categories = ['All', 'A2 Ghee', 'Cow Ghee', 'Buffalo Ghee'];

export default function ShopPage() {
  const [products, setProducts] = useState<(Product & { product_variants: ProductVariant[] })[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark-brown mb-4">
            Our Products
          </h1>
          <p className="text-medium-brown max-w-2xl mx-auto">
            Discover our range of premium ghee products, each crafted with care using traditional methods.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={'px-6 py-2 rounded-full font-medium transition-all ' + (
                selectedCategory === category
                  ? 'bg-gold text-dark-brown shadow-md'
                  : 'bg-white text-dark-brown hover:bg-gold/20'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-medium-brown">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-medium-brown">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
