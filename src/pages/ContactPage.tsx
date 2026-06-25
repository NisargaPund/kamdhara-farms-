import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Button from '../components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Get in Touch</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark-brown mt-2 mb-4">
            Contact Us
          </h1>
          <p className="text-medium-brown max-w-2xl mx-auto">
            Have questions about our products? Want to place a bulk order?
            We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gold/20 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-brown">Email</h3>
                  <a
                    href="mailto:support@kamdharafarms.com"
                    className="text-medium-brown hover:text-gold transition-colors"
                  >
                    support@kamdharafarms.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gold/20 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-brown">Phone</h3>
                  <a
                    href="tel:+918766703485"
                    className="text-medium-brown hover:text-gold transition-colors"
                  >
                    +91 87667 03485
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gold/20 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-brown">Address</h3>
                  <p className="text-medium-brown">
                    Kamdhara Farms<br />
                    Baramati, Maharashtra
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gold/20 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-brown">Business Hours</h3>
                  <p className="text-medium-brown">
                    Mon - Sat: 9:00 AM - 6:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {submitted ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="bg-gold/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-gold" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-dark-brown mb-2">
                  Message Sent!
                </h2>
                <p className="text-medium-brown">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-brown mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-brown mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                      placeholder="+91 87667 03485"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Subject</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold"
                  >
                    <option value="">Select a subject</option>
                    <option value="product">Product Inquiry</option>
                    <option value="order">Order Status</option>
                    <option value="bulk">Bulk Orders</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 border border-medium-brown/30 rounded-lg focus:outline-none focus:border-gold resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button type="submit" variant="gold" size="lg" isLoading={isSubmitting} className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
