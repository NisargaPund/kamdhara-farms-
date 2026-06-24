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
            <p className="text-medium-brown">Last updated: January 2024</p>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Acceptance of Terms
              </h2>
              <p className="text-medium-brown leading-relaxed">
                By accessing and using the Kamdhara Farms website, you accept and agree to be bound
                by these Terms of Service. If you do not agree to these terms, please do not use
                our services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Products and Pricing
              </h2>
              <p className="text-medium-brown leading-relaxed">
                All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes.
                We reserve the right to modify prices without notice. Product images are for
                illustration purposes; actual products may vary slightly in appearance.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Orders and Payment
              </h2>
              <p className="text-medium-brown leading-relaxed">
                All orders are subject to acceptance and availability. We accept payments via
                Credit/Debit cards, UPI, and Cash on Delivery. Payment information is processed
                securely through trusted payment gateways.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Shipping and Delivery
              </h2>
              <p className="text-medium-brown leading-relaxed">
                We ship across India through trusted courier partners. Delivery times are estimates
                and may vary. Risk of loss passes to you upon delivery to the carrier. We are not
                responsible for delays caused by courier services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Intellectual Property
              </h2>
              <p className="text-medium-brown leading-relaxed">
                All content on this website, including text, images, logos, and design, is the
                property of Kamdhara Farms and is protected by copyright laws. Unauthorized
                use is prohibited.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Limitation of Liability
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Kamdhara Farms shall not be liable for any indirect, incidental, or consequential
                damages arising from the use of our products or services. Our maximum liability
                is limited to the purchase price of the product.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
