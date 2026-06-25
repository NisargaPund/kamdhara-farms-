import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GHEE_PROCESS_STEPS } from '../../lib/gheeProcessSteps';

export default function ProcessSection() {
  return (
    <section className="py-20 bg-white" aria-labelledby="ghee-process-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-gold text-sm tracking-widest uppercase">How It&apos;s Made</span>
          <h2
            id="ghee-process-heading"
            className="font-serif text-4xl md:text-5xl font-bold text-dark-brown mt-2 mb-4"
          >
            From Pasture to Jar
          </h2>
          <p className="text-medium-brown max-w-2xl mx-auto">
            Every jar follows the same traditional bilona journey — grass-fed cows, hand-churned butter,
            and slow wood-fire clarification. No shortcuts, no compromises.
          </p>
        </motion.div>

        {/* Desktop: horizontal flow */}
        <div className="hidden xl:block">
          <div className="relative">
            <div className="absolute top-[7.5rem] left-[8%] right-[8%] h-0.5 bg-gold/30" aria-hidden="true" />
            <div className="grid grid-cols-7 gap-3">
              {GHEE_PROCESS_STEPS.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-dark-brown font-serif text-lg font-bold shadow-md ring-4 ring-white">
                    {step.step}
                  </div>
                  <div className="w-full overflow-hidden rounded-xl shadow-lg ring-1 ring-dark-brown/5">
                    <img
                      src={step.image}
                      alt={step.imageAlt}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                  <h3 className="font-serif text-base font-bold text-dark-brown mt-4 mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-medium-brown text-xs leading-relaxed px-1">{step.description}</p>
                  {index < GHEE_PROCESS_STEPS.length - 1 && (
                    <ArrowRight
                      className="absolute -right-2 top-[6.75rem] z-20 h-4 w-4 text-gold"
                      aria-hidden="true"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Tablet: 2-column grid */}
        <div className="hidden md:grid xl:hidden grid-cols-2 gap-8">
          {GHEE_PROCESS_STEPS.map((step, index) => (
            <motion.article
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="flex gap-4 bg-cream/50 rounded-2xl p-4 ring-1 ring-dark-brown/5"
            >
              <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-dark-brown font-serif font-bold">
                {step.step}
              </div>
              <div className="min-w-0">
                <div className="overflow-hidden rounded-xl shadow-md mb-3">
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                </div>
                <h3 className="font-serif text-lg font-bold text-dark-brown mb-1">{step.title}</h3>
                <p className="text-medium-brown text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden space-y-8">
          {GHEE_PROCESS_STEPS.map((step, index) => (
            <motion.article
              key={step.step}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative pl-10"
            >
              {index < GHEE_PROCESS_STEPS.length - 1 && (
                <div
                  className="absolute left-[1.125rem] top-12 bottom-0 w-0.5 bg-gold/30 -mb-8"
                  aria-hidden="true"
                />
              )}
              <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-gold text-dark-brown font-serif text-sm font-bold shadow-md ring-4 ring-white">
                {step.step}
              </div>
              <div className="overflow-hidden rounded-xl shadow-lg mb-3 ring-1 ring-dark-brown/5">
                <img
                  src={step.image}
                  alt={step.imageAlt}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-bold text-dark-brown mb-2">{step.title}</h3>
              <p className="text-medium-brown text-sm leading-relaxed">{step.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
