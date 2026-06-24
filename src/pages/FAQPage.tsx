import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    category: 'About Our Products',
    questions: [
      {
        question: 'What is A2 Ghee and why is it special?',
        answer: 'A2 ghee is made from the milk of cows that produce only A2 beta-casein protein. Indigenous Indian breeds like Gir cows produce A2 milk, which is easier to digest and has been linked to numerous health benefits. Regular commercial ghee often comes from cows that produce A1 protein, which some people find harder to digest.',
      },
      {
        question: 'What is the Bilona method?',
        answer: 'The Bilona method is an ancient Ayurvedic technique for making ghee. First, milk is converted to curd using natural cultures. Then, the curd is hand-churned to extract butter. Finally, this butter is slow-cooked over a wood fire. This traditional method preserves all nutrients and creates ghee with superior flavor and medicinal properties.',
      },
      {
        question: 'What are the health benefits of Gir Cow Ghee?',
        answer: 'Gir cow ghee is rich in Omega-3 fatty acids, CLA (Conjugated Linoleic Acid), and vitamins A, D, E, and K. It supports digestive health, strengthens the immune system, promotes brain function, and according to Ayurveda, enhances memory and intellect. Its high smoke point (250°C) makes it ideal for cooking.',
      },
    ],
  },
  {
    category: 'Orders & Shipping',
    questions: [
      {
        question: 'What are your shipping charges?',
        answer: 'We offer free shipping on all orders above Rs. 999. For orders below Rs. 999, a flat shipping fee of Rs. 99 applies. We deliver across India through trusted courier partners.',
      },
      {
        question: 'How long does delivery take?',
        answer: 'Metro cities: 3-5 business days. Other cities: 5-7 business days. Remote areas: 7-10 business days. You will receive a tracking number via SMS once your order is shipped.',
      },
      {
        question: 'Do you offer Cash on Delivery?',
        answer: 'Yes, Cash on Delivery (COD) is available for all pin codes serviced by our courier partners. There are no additional COD charges. You can also pay via UPI (Google Pay, PhonePe, Paytm) or Credit/Debit cards.',
      },
    ],
  },
  {
    category: 'Storage & Usage',
    questions: [
      {
        question: 'How should I store the ghee?',
        answer: 'Store in a cool, dry place away from direct sunlight. No refrigeration is needed. Always use a clean, dry spoon. The ghee has a shelf life of 12 months from the date of manufacture.',
      },
      {
        question: 'How much ghee should I consume daily?',
        answer: 'According to Ayurveda, 1-2 teaspoons (5-10ml) of ghee per day is beneficial for most adults. It can be consumed directly, added to rice, rotis, or used for cooking. However, please consult your doctor if you have specific health conditions.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, number>>({});

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const key = categoryIndex + '-' + questionIndex;
    setOpenItems(prev => ({
      ...prev,
      [key]: prev[key] === 1 ? 0 : 1,
    }));
  };

  return (
    <div className="pt-24 pb-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Help Center</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark-brown mt-2 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-medium-brown">
            Find answers to common questions about our products, orders, and more.
          </p>
        </motion.div>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h2 className="font-serif text-2xl font-bold text-dark-brown mb-4">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((faq, faqIndex) => {
                  const key = catIndex + '-' + faqIndex;
                  const isOpen = openItems[key] === 1;
                  return (
                    <div
                      key={faqIndex}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(catIndex, faqIndex)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-cream/50 transition-colors"
                      >
                        <span className="font-medium text-dark-brown pr-4">{faq.question}</span>
                        {isOpen ? (
                          <Minus className="w-5 h-5 text-gold flex-shrink-0" />
                        ) : (
                          <Plus className="w-5 h-5 text-gold flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <p className="text-medium-brown">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
