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
            Return, Replacement & Refund Policy
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <p className="text-medium-brown">Last updated: June 24, 2025</p>

            <section>
              <p className="text-medium-brown leading-relaxed">
                At Kamdhara Farms, every product is carefully inspected, sealed, and securely
                packed before dispatch.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Open Box Delivery Policy
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Customers are requested to inspect the package at the time of delivery.
              </p>
              <p className="text-medium-brown leading-relaxed mt-2">
                Any visible damage, leakage, breakage, tampering, or incorrect product must be
                reported immediately during delivery.
              </p>
              <p className="text-medium-brown leading-relaxed mt-2">
                Once the customer accepts the delivery and the courier partner marks the order as
                delivered, the product shall be deemed accepted in good condition.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                No Returns or Refunds After Acceptance
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Kamdhara Farms shall not accept any return, replacement, or refund request after
                the product has been accepted during delivery.
              </p>
              <p className="text-medium-brown leading-relaxed mt-2">
                Claims for:
              </p>
              <ul className="text-medium-brown list-disc list-inside space-y-1 mt-2">
                <li>Damaged jars</li>
                <li>Leakage</li>
                <li>Broken packaging</li>
                <li>Missing items</li>
              </ul>
              <p className="text-medium-brown leading-relaxed mt-2">
                will not be accepted after delivery acceptance.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Non-Returnable Products
              </h2>
              <p className="text-medium-brown leading-relaxed">
                The following products are strictly non-returnable:
              </p>
              <ul className="text-medium-brown list-disc list-inside space-y-1 mt-2">
                <li>Opened jars</li>
                <li>Broken seals</li>
                <li>Used products</li>
                <li>Partially consumed products</li>
                <li>Products damaged due to improper storage</li>
                <li>Change of mind purchases</li>
                <li>Taste preference issues</li>
                <li>Texture, aroma, or colour preference issues</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Refund Eligibility
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Refunds shall only be considered if:
              </p>
              <ul className="text-medium-brown list-disc list-inside space-y-1 mt-2">
                <li>Wrong product is delivered</li>
                <li>Product is damaged before delivery acceptance</li>
                <li>Product is declared undeliverable by courier</li>
              </ul>
              <p className="text-medium-brown leading-relaxed mt-2">
                Kamdhara Farms reserves the right to verify all claims before approval.
              </p>
            </section>

            <section>
              <p className="text-medium-brown leading-relaxed">
                By placing an order, the customer agrees to this policy.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
