import { motion } from 'framer-motion';

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
            About Kamdhara Farms
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <img
              src="https://images.pexels.com/photos/4226880/pexels-photo-4226880.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Traditional ghee making"
              className="rounded-2xl shadow-xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-serif text-3xl font-bold text-dark-brown mb-4">
              Three Generations of Dedication
            </h2>
            <p className="text-medium-brown mb-4 leading-relaxed">
              In 1952, our grandfather began a small journey in the heart of Gujarat, tending to
              Gir cows with unwavering dedication. What started as a family tradition has grown
              into a mission to deliver the purest A2 Ghee to homes across India.
            </p>
            <p className="text-medium-brown leading-relaxed">
              Today, three generations later, we continue to honor his legacy. Our Gir cows
              graze on natural pastures, and we use the ancient bilona method to hand-churn
              our ghee, preserving every drop of nutrition and flavor.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { number: '70+', label: 'Years of Heritage' },
            { number: '500+', label: 'Gir Cows' },
            { number: '1M+', label: 'Happy Customers' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="text-center bg-white p-8 rounded-xl shadow-md"
            >
              <p className="font-serif text-4xl font-bold text-gold">{stat.number}</p>
              <p className="text-medium-brown mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-brown rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="font-serif text-3xl font-bold text-white mb-4">The Bilona Method</h2>
          <p className="text-cream/80 max-w-3xl mx-auto leading-relaxed">
            The bilona method is an ancient Ayurvedic technique where curd is hand-churned
            to extract butter, which is then slow-cooked over a wood fire. This traditional
            process preserves all natural nutrients, enzymes, and the authentic flavor
            that makes our ghee truly special. Unlike modern industrial methods that use
            direct cream, bilona ghee retains its medicinal properties as described in
            Ayurvedic texts.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
