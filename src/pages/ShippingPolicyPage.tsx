import { motion } from 'framer-motion';

export default function ShippingPolicyPage() {
  return (
    <div className="pt-24 pb-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-4xl font-bold text-dark-brown mb-8">
            Shipping Policy
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <p className="text-medium-brown">Last updated: June 24, 2025</p>

            <section>
              <p className="text-medium-brown leading-relaxed">
                All Kamdhara Farms products are shipped using secure packaging designed
                specifically for glass jars.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Order Processing
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Orders are processed within 1-3 business days after payment confirmation.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Delivery Timelines
              </h2>
              <ul className="text-medium-brown space-y-2">
                <li><strong>Maharashtra:</strong> 2-5 Business Days</li>
                <li><strong>Rest of India:</strong> 3-10 Business Days</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Open Box Delivery
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Customers are strongly encouraged to inspect the parcel at the time of delivery.
              </p>
              <p className="text-medium-brown leading-relaxed mt-2">
                Any damage, leakage, breakage, or incorrect product must be reported before
                accepting the package.
              </p>
              <p className="text-medium-brown leading-relaxed mt-2">
                After delivery acceptance, Kamdhara Farms shall not be responsible for
                transit-related damages.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Address Responsibility
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Customers are responsible for providing accurate shipping information.
              </p>
              <p className="text-medium-brown leading-relaxed mt-2">
                Orders returned due to incorrect address, unavailability, or refusal to accept
                delivery may attract re-shipping charges.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Force Majeure
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Delivery timelines may be affected by natural disasters, strikes, transportation
                issues, weather conditions, government restrictions, or other circumstances
                beyond our control.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
