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
            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Shipping Charges
              </h2>
              <p className="text-medium-brown leading-relaxed">
                We offer FREE shipping on all orders above Rs. 999. For orders below Rs. 999,
                a flat shipping fee of Rs. 99 applies.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Delivery Timeline
              </h2>
              <ul className="text-medium-brown space-y-2">
                <li><strong>Metro Cities:</strong> 3-5 business days</li>
                <li><strong>Other Cities:</strong> 5-7 business days</li>
                <li><strong>Remote Areas:</strong> 7-10 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Order Tracking
              </h2>
              <p className="text-medium-brown leading-relaxed">
                Once your order is shipped, you will receive an SMS with your tracking number
                and courier partner details. You can track your order using the courier's
                website or app.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Shipping Partners
              </h2>
              <p className="text-medium-brown leading-relaxed">
                We work with trusted courier partners including Delhivery, BlueDart, and
                DTDC to ensure safe and timely delivery of your orders.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Packaging
              </h2>
              <p className="text-medium-brown leading-relaxed">
                All our ghee products are carefully packed in temperature-safe packaging to
                maintain quality during transit. Glass jars are protected with bubble wrap
                and sturdy outer boxes to prevent breakage.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-bold text-dark-brown mb-3">
                Serviceable Areas
              </h2>
              <p className="text-medium-brown leading-relaxed">
                We deliver to most pin codes across India. If your pin code is not serviceable,
                you will be notified at checkout. For bulk orders or special delivery requests,
                please contact us at hello@kamdhara.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
