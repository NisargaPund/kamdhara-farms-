import { motion } from 'framer-motion';

export default function ReturnPolicyPage() {
  return (
    <div className="pt-24 pb-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-4xl font-bold text-dark-brown mb-8">
            Return & Refund Policy
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Our Guarantee
              </h2>
              <p className="text-medium-brown leading-relaxed">
                At Kamdhara Farms, we stand behind the quality of our products. If you're not
                completely satisfied with your purchase, we're here to help.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Returns
              </h2>
              <p className="text-medium-brown leading-relaxed">
                We accept returns within 7 days of delivery under the following conditions:
              </p>
              <ul className="text-medium-brown list-disc list-inside space-y-1 mt-2">
                <li>Product is unopened and seal is intact</li>
                <li>Packaging is in original condition</li>
                <li>You have the original invoice/receipt</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Damaged Products
              </h2>
              <p className="text-medium-brown leading-relaxed">
                If you receive a damaged product, please report it within 24 hours of delivery
                with photos of the damage. We will arrange for a replacement or full refund.
                Contact us at hello@kamdhara.com or +91 98765 43210.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Exchanges
              </h2>
              <p className="text-medium-brown leading-relaxed">
                We only replace items if they are defective or damaged. If you need to exchange
                for a different size or product, please return the original item for a refund
                and place a new order.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Refund Process
              </h2>
              <ol className="text-medium-brown list-decimal list-inside space-y-2">
                <li>Initiate return request via email or phone</li>
                <li>We will arrange a pickup from your location</li>
                <li>Once received and verified, refund will be processed within 5-7 business days</li>
                <li>Refund will be credited to the original payment method</li>
              </ol>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Non-Returnable Items
              </h2>
              <p className="text-medium-brown leading-relaxed">
                For hygiene reasons, we cannot accept returns on opened or used ghee products.
                Sale items and gift cards are non-returnable.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Questions?
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Contact us at hello@kamdhara.com or +91 98765 43210 for any return-related queries.
                We're happy to assist you.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
