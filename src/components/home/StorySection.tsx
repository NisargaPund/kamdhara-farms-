import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { STORY_IMAGE } from '../../lib/imagePaths';

export default function StorySection() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative w-full max-w-md mx-auto md:mx-0"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={STORY_IMAGE}
                alt="Kamdhara Farms — traditional ghee crafted with care in Maharashtra"
                loading="lazy"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gold text-dark-brown px-3 py-2 rounded-lg shadow-md">
              <p className="font-serif text-sm font-bold leading-tight">Proudly</p>
              <p className="font-serif text-lg font-bold leading-tight">Maharashtra</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center max-w-lg lg:max-w-xl mx-auto md:mx-0 md:pl-2 lg:pl-4"
          >
            <span className="text-gold text-sm tracking-widest uppercase">Our Story</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-dark-brown mt-2 mb-6 md:mb-8 leading-tight">
              Rooted in Tradition. Crafted with Purity.
            </h2>
            <div className="space-y-5 text-medium-brown text-base md:text-lg leading-relaxed mb-8">
              <p>
                Kamdhara Farms was born from a memory that goes back to my childhood — of my grandmother
                carefully preparing ghee using traditional methods in Maharashtra, filling the home with an
                aroma that brought the entire family together.
              </p>
              <p>
                As I grew older, I realized that the taste, aroma, and purity of traditionally crafted ghee
                were becoming harder to find. Inspired by those memories, I started Kamdhara Farms to bring
                the richness of traditional Maharashtra-made ghee to modern families without compromising on
                quality, purity, or authenticity.
              </p>
              <p className="font-serif text-dark-brown italic">
                Great ghee is not made in a hurry. It is crafted with patience, care, and respect for
                tradition.
              </p>
            </div>
            <Link to="/about">
              <Button variant="primary">Learn More About Us</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
