import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What is A2 Ghee?',
    answer: 'A2 ghee is made from the milk of cows that produce only A2 beta-casein protein, as opposed to A1 protein found in most commercial dairy. Indigenous Indian cow breeds like Gir produce A2 milk, which is easier to digest and has numerous health benefits.',
  },
  {
    question: 'How is Kamdhara Ghee made?',
    answer: 'Our ghee is made using the traditional bilona method. We first make curd from A2 Gir cow milk, then hand-churn it to extract butter, which is then slow-cooked over a wood fire to produce ghee. This ancient method preserves all nutrients and gives our ghee its unique aroma and taste.',
  },
  {
    question: 'What is the shelf life of your ghee?',
    answer: 'Our ghee has a shelf life of 12 months when stored in a cool, dry place away from direct sunlight. No refrigeration is required.',
  },
  {
    question: 'How much ghee should I consume daily?',
    answer: 'According to Ayurveda, 1-2 teaspoons of ghee per day is beneficial for most adults. It can be consumed directly, added to warm rice or rotis, or used for cooking.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-gold text-xs md:text-sm tracking-widest uppercase">FAQ</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-dark-brown mt-1.5 md:mt-2">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-medium-brown/20 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-3 md:p-4 text-left bg-cream hover:bg-cream/80 transition-colors gap-3"
              >
                <span className="font-semibold text-dark-brown text-sm md:text-base">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="w-4 h-4 md:w-5 md:h-5 text-gold shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 md:w-5 md:h-5 text-gold shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="p-3 md:p-4 bg-white">
                  <p className="text-medium-brown text-sm md:text-base">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
