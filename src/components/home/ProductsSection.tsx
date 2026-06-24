import { motion } from 'framer-motion';
import ProductCard from '../product/ProductCard';
import type { Product, ProductVariant } from '../../types';

interface ProductsSectionProps {
  products: (Product & { product_variants: ProductVariant[] })[];
}

export default function ProductsSection({ products }: ProductsSectionProps) {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Our Collection</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-dark-brown mt-2 mb-4">
            Premium Ghee Selection
          </h2>
          <p className="text-medium-brown max-w-2xl mx-auto">
            Handcrafted with love using the traditional bilona method from the milk of our heritage Gir cows.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
