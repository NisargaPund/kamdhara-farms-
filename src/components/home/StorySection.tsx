import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

export default function StorySection() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/4226880/pexels-photo-4226880.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Traditional ghee making"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-gold text-dark-brown p-6 rounded-xl shadow-lg">
              <p className="font-serif text-3xl font-bold">Since</p>
              <p className="font-serif text-4xl font-bold">1952</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold text-sm tracking-widest uppercase">Our Story</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-dark-brown mt-2 mb-6">
              Three Generations of Purity
            </h2>
            <p className="text-medium-brown mb-4 leading-relaxed">
              What started as a small family tradition has grown into a mission to deliver
              the purest A2 Gir Cow Ghee to families across India. Our grandfather began
              this journey in 1952, tending to our beloved Gir cows in the lush pastures
              of Gujarat.
            </p>
            <p className="text-medium-brown mb-6 leading-relaxed">
              Today, we continue his legacy using the same ancient bilona method,
              hand-churning the curd to produce ghee that retains all its natural
              nutrients, aroma, and taste. Every jar carries the essence of three
              generations of dedication.
            </p>
            <Link to="/about">
              <Button variant="primary">Learn More About Us</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
