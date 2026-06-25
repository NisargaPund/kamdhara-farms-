import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
  return (
    <div className="pt-24 pb-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-4xl font-bold text-dark-brown mb-8">
            Terms of Service
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <p className="text-medium-brown leading-relaxed">
              By using the Kamdhara Farms website and purchasing our products, you agree to
              the following terms:
            </p>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                1. Product Acceptance
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Acceptance of delivery confirms that the customer has received the product in
                satisfactory condition.
              </p>
              <p className="text-medium-brown leading-relaxed mt-2">
                No claims regarding physical damage, leakage, breakage, or missing items shall
                be accepted after delivery acceptance.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                2. Food Product Policy
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Due to the consumable nature of our products:
              </p>
              <ul className="text-medium-brown list-disc list-inside space-y-1 mt-2">
                <li>Opened jars are non-returnable.</li>
                <li>Broken seals void return eligibility.</li>
                <li>Consumed products cannot be refunded.</li>
                <li>Personal taste preferences are not grounds for return.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                3. Product Variations
              </h2>
              <p className="text-medium-brown leading-relaxed">
                As our products are made from natural ingredients, minor variations in colour,
                aroma, texture, and consistency may occur.
              </p>
              <p className="text-medium-brown leading-relaxed mt-2">
                Such variations shall not be considered defects.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                4. Limitation of Liability
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Kamdhara Farms shall not be liable for indirect, incidental, or consequential
                losses arising from product use.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                5. Fraudulent Claims
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Kamdhara Farms reserves the right to reject any claim that appears fraudulent,
                misleading, or unsupported by evidence.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
