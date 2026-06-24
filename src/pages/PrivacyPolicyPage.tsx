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
            <p className="text-medium-brown">Last updated: January 2024</p>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Information We Collect
              </h2>
              <p className="text-medium-brown leading-relaxed">
                We collect information you provide directly to us, such as when you create an account,
                place an order, or contact us for support. This may include your name, email address,
                phone number, shipping address, and payment information.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                How We Use Your Information
              </h2>
              <p className="text-medium-brown leading-relaxed">
                We use the information we collect to process orders, communicate with you about your
                purchases, send you marketing communications (if you've opted in), and improve our
                services. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Data Security
              </h2>
              <p className="text-medium-brown leading-relaxed">
                We implement industry-standard security measures to protect your personal information.
                All payment transactions are encrypted using SSL technology. Your data is stored
                securely and access is restricted to authorized personnel only.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Your Rights
              </h2>
              <p className="text-medium-brown leading-relaxed">
                You have the right to access, correct, or delete your personal information. You may
                also opt out of marketing communications at any time. To exercise these rights,
                please contact us at hello@kamdhara.com.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Contact Us
              </h2>
              <p className="text-medium-brown leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at
                hello@kamdhara.com or +91 98765 43210.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
