import { motion } from 'framer-motion';
import { STORY_IMAGE } from '../lib/imagePaths';

const principles = [
  { title: 'Pure ingredients', description: 'Carefully selected milk and nothing unnecessary.' },
  { title: 'Traditional craftsmanship', description: 'Slow, patient methods that honor how ghee was always made.' },
  { title: 'Honest sourcing', description: 'Transparent choices from source to jar.' },
  { title: 'Uncompromising quality', description: 'Every batch held to the same standard of purity.' },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Our Story</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark-brown mt-2 mb-4">
            Rooted in Tradition. Crafted with Purity.
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-start mb-16 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col justify-center w-full max-w-prose md:pt-2"
          >
            <div className="space-y-5 text-medium-brown text-base md:text-lg leading-relaxed">
              <p>
                Kamdhara Farms was born from a memory that goes back to my childhood.
              </p>
              <p>
                Growing up in Maharashtra, some of my earliest memories are of my grandmother carefully
                preparing ghee using traditional methods. Every batch was crafted with patience, care, and
                an unwavering commitment to purity. What started as fresh milk would slowly transform into
                rich, golden ghee, filling the home with an aroma that brought the entire family together.
              </p>
              <p>
                Back then, ghee wasn&apos;t just an ingredient. It was a tradition passed down through
                generations. It was a symbol of nourishment, authenticity, and home.
              </p>
              <p>
                As I grew older, I realized that the taste, aroma, and purity of traditionally crafted ghee
                were becoming harder to find. Many products had become commercialized, but the values behind
                authentic ghee remained unchanged.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="text-medium-brown text-base md:text-lg leading-relaxed mb-6">
            Inspired by those childhood memories and the craftsmanship I witnessed firsthand, I started
            Kamdhara Farms with a simple vision:
          </p>
          <p className="font-serif text-2xl md:text-3xl font-bold text-dark-brown leading-snug">
            To bring the richness of traditional Maharashtra-made ghee to modern families without
            compromising on quality, purity, or authenticity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-16"
        >
          <h2 className="font-serif text-3xl font-bold text-dark-brown text-center mb-8">
            What Guides Every Jar
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center bg-white p-6 rounded-xl shadow-md"
              >
                <p className="font-serif text-lg font-bold text-gold mb-2">{principle.title}</p>
                <p className="text-medium-brown text-sm leading-relaxed">{principle.description}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-medium-brown text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto mt-10">
            While we have grown beyond a family kitchen, our belief remains the same: great ghee is not
            made in a hurry. It is crafted with patience, care, and respect for tradition.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-md mb-16 max-w-4xl mx-auto"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Our Philosophy</span>
          <h2 className="font-serif text-3xl font-bold text-dark-brown mt-2 mb-6">
            Purity Begins at the Source
          </h2>
          <div className="space-y-5 text-medium-brown text-base md:text-lg leading-relaxed">
            <p>
              At Kamdhara Farms, we believe that purity begins at the source.
            </p>
            <p>
              From carefully selected milk to traditional preparation methods, every step is guided by one
              purpose: delivering authentic ghee that families can trust.
            </p>
            <p>
              We don&apos;t see our products as just another kitchen staple. We see them as a continuation
              of a tradition that has nourished generations.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Proudly Crafted in Maharashtra</span>
          <h2 className="font-serif text-3xl font-bold text-dark-brown mt-2 mb-6">
            Born in the Heart of Maharashtra
          </h2>
          <div className="space-y-5 text-medium-brown text-base md:text-lg leading-relaxed">
            <p>
              Kamdhara Farms celebrates the rich dairy heritage of our region. The values of hard work,
              authenticity, and family traditions are deeply woven into everything we create.
            </p>
            <p>
              Every jar represents a commitment to preserving the taste and quality that generations have
              cherished.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-dark-brown rounded-2xl p-8 md:p-12 text-center"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Brand Statement</span>
          <p className="font-serif text-2xl md:text-3xl font-bold text-white mt-4 leading-relaxed max-w-3xl mx-auto">
            From our grandmother&apos;s kitchen to your family&apos;s table — carrying forward a tradition
            of purity, one spoonful at a time.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
