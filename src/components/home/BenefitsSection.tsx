import { motion } from 'framer-motion';
import { Droplets, Leaf, Shield, Award, Heart, Flame } from 'lucide-react';

const benefits = [
  {
    icon: Droplets,
    title: '100% Pure A2',
    description: 'Made exclusively from A2 milk of indigenous Gir cows, free from A1 beta-casein.',
  },
  {
    icon: Leaf,
    title: 'Grass-Fed Cows',
    description: 'Our cows graze on natural pastures, ensuring nutrient-rich milk.',
  },
  {
    icon: Shield,
    title: 'No Preservatives',
    description: 'Zero additives, chemicals, or preservatives. Just pure ghee.',
  },
  {
    icon: Award,
    title: 'Bilona Method',
    description: 'Hand-churned using the ancient bilona technique for maximum nutrition.',
  },
  {
    icon: Heart,
    title: 'Heart Healthy',
    description: 'Rich in Omega-3, CLA, and vitamins A, D, E, and K.',
  },
  {
    icon: Flame,
    title: 'High Smoke Point',
    description: 'Perfect for cooking at high temperatures without oxidation.',
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-dark-brown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Why Choose Us</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            The Kamdhara Difference
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-medium-brown/20 p-6 rounded-xl text-center hover:bg-medium-brown/30 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                <benefit.icon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-cream/80">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
