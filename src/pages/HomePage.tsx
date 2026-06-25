import { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import ProductsSection from '../components/home/ProductsSection';
import BenefitsSection from '../components/home/BenefitsSection';
import ProcessSection from '../components/home/ProcessSection';
import StorySection from '../components/home/StorySection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FAQSection from '../components/home/FAQSection';
import { getProducts } from '../lib/supabase';
import type { Product, ProductVariant } from '../types';

export default function HomePage() {
  const [products, setProducts] = useState<(Product & { product_variants: ProductVariant[] })[]>([]);
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

  return (
    <div>
      <HeroSection />
      {loading ? (
        <div className="py-20 text-center">
          <p className="text-medium-brown">Loading products...</p>
        </div>
      ) : (
        <ProductsSection products={products} />
      )}
      <BenefitsSection />
      <ProcessSection />
      <StorySection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}
