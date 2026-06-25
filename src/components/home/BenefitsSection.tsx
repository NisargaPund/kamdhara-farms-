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
    <section className="py-12 md:py-20 bg-dark-brown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-gold text-xs md:text-sm tracking-widest uppercase">Why Choose Us</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-1.5 md:mt-2 mb-3 md:mb-4">
            The Kamdhara Difference
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 min-w-0">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-medium-brown/20 p-3 md:p-6 rounded-lg md:rounded-xl text-center hover:bg-medium-brown/30 transition-colors min-w-0"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-full bg-gold/20 mb-2 md:mb-4">
                <benefit.icon className="w-5 h-5 md:w-8 md:h-8 text-gold" />
              </div>
              <h3 className="font-serif text-sm md:text-xl font-semibold text-white mb-1 md:mb-2 leading-snug">{benefit.title}</h3>
              <p className="text-cream/80 text-xs md:text-base leading-snug">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
