import { motion } from 'framer-motion';
import ProductCard from '../product/ProductCard';
import type { Product, ProductVariant } from '../../types';

interface ProductsSectionProps {
  products: (Product & { product_variants: ProductVariant[] })[];
}

export default function ProductsSection({ products }: ProductsSectionProps) {
  return (
    <section className="py-12 md:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-gold text-xs md:text-sm tracking-widest uppercase">Our Collection</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-dark-brown mt-1.5 md:mt-2 mb-3 md:mb-4">
            Premium Ghee Selection
          </h2>
          <p className="text-medium-brown text-sm md:text-base max-w-2xl mx-auto px-1">
            From pure desi cow ghee to rich buffalo bilona ghee — each jar is
            handcrafted with the same traditional bilona method and uncompromising quality.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 items-stretch">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="min-w-0">
              <ProductCard product={product} imageOnly />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
