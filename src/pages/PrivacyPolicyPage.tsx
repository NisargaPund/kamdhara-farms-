import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 pb-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-4xl font-bold text-dark-brown mb-8">
            Privacy Policy
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <p className="text-medium-brown">Last updated: June 24, 2025</p>

            <section>
              <p className="text-medium-brown leading-relaxed">
                Kamdhara Farms respects your privacy.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Information We Collect
              </h2>
              <p className="text-medium-brown leading-relaxed">We may collect:</p>
              <ul className="text-medium-brown list-disc list-inside space-y-1 mt-2">
                <li>Name</li>
                <li>Mobile Number</li>
                <li>Email Address</li>
                <li>Billing Address</li>
                <li>Shipping Address</li>
                <li>Order Details</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                How We Use Your Information
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Your information is used only for:
              </p>
              <ul className="text-medium-brown list-disc list-inside space-y-1 mt-2">
                <li>Processing orders</li>
                <li>Shipping products</li>
                <li>Customer support</li>
                <li>Order updates</li>
                <li>Legal compliance</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Data Protection
              </h2>
              <p className="text-medium-brown leading-relaxed">
                We do not sell, rent, or share customer information with third parties except as
                required for payment processing, shipping, or legal obligations.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Marketing Communication
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Customers may receive order updates and promotional communications. Customers may
                unsubscribe at any time.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Security
              </h2>
              <p className="text-medium-brown leading-relaxed">
                We use commercially reasonable measures to protect customer information.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Contact
              </h2>
              <p className="text-medium-brown leading-relaxed">
                For privacy-related concerns:
              </p>
              <p className="text-medium-brown leading-relaxed mt-2">
                Email: support@kamdharafarms.com
              </p>
              <p className="text-medium-brown leading-relaxed">
                Phone: +91 87667 03485
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
