import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const HERO_IMAGE = '/hero%20section%20image.png';

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[clamp(640px,85vh,900px)] flex items-center mb-8 sm:mb-10"
      aria-label="Hero"
    >
      {/* Panoramic farm hero background — overflow clipped here, not on section (avoids text clipping) */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Kaamdhara Farms ghee jars — Buffalo Bilona, A2 Gir Cow Bilona, and Pure Desi Cow Ghee — on a wooden table with rural India backdrop"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          className="w-full h-full object-cover object-[center_48%] sm:object-[center_52%] lg:object-[center_55%]"
        />
        {/* Layered gradients for readable text overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A1A10]/88 via-[#2A1A10]/50 to-[#2A1A10]/10 sm:from-[#2A1A10]/82 sm:via-[#2A1A10]/40 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A1A10]/55 via-transparent to-[#2A1A10]/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1A10]/25 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-xl lg:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 text-gold text-xs sm:text-sm tracking-[0.25em] uppercase mb-4 sm:mb-5">
              <span className="h-px w-6 sm:w-8 bg-gold/60" />
              Kaamdhara Farms
              <span className="h-px w-6 sm:w-8 bg-gold/60 hidden sm:block" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream mb-4 leading-[1.1]"
          >
            Traditionally Crafted
            <br />
            <span className="text-gold">Bilona Ghee</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-gold/90 font-serif text-base sm:text-lg md:text-xl italic mb-4"
          >
            Three heritage lines, one promise of purity
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-cream/85 text-base sm:text-lg max-w-lg mb-8 leading-relaxed"
          >
            From A2 Gir cow and pure desi cow ghee to rich buffalo bilona — each
            jar is slow-churned by hand, preserving the aroma, flavour, and warmth
            of traditional Indian farms.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link to="/shop">
              <Button variant="gold" size="lg" className="w-full sm:w-auto shadow-lg shadow-black/20">
                Shop Now
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto bg-cream/10 text-cream border-cream/40 hover:bg-cream hover:text-dark-brown backdrop-blur-sm"
              >
                Our Story
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 sm:mt-10 flex flex-wrap gap-x-4 gap-y-2 text-cream/60 text-xs sm:text-sm tracking-wide"
          >
            <span>Buffalo Bilona</span>
            <span className="text-gold/50 hidden sm:inline">·</span>
            <span>A2 Gir Cow Bilona</span>
            <span className="text-gold/50 hidden sm:inline">·</span>
            <span>Pure Desi Cow Ghee</span>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-cream/50"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
