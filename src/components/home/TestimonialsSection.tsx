import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    comment: 'The best ghee I have ever tasted! You can smell the purity the moment you open the jar. My whole family loves it.',
  },
  {
    name: 'Rahul Patel',
    location: 'Ahmedabad',
    rating: 5,
    comment: 'Finally found authentic A2 ghee. The flavor is incredible and knowing it is made from Gir cows makes it even more special.',
  },
  {
    name: 'Anita Verma',
    location: 'Delhi',
    rating: 5,
    comment: "I've been buying from Kamdhara Farms for 2 years now. The quality is consistent and the taste reminds me of my grandmother's ghee.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-cream to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Testimonials</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-dark-brown mt-2">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-dark-brown mb-4 italic">"{testimonial.comment}"</p>
              <div className="border-t pt-4">
                <p className="font-semibold text-dark-brown">{testimonial.name}</p>
                <p className="text-sm text-medium-brown">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
