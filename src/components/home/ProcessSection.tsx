import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { GHEE_PROCESS_STEPS, type GheeProcessStep } from '../../lib/gheeProcessSteps';

function ProcessCard({
  step,
  index,
  className = '',
}: {
  step: GheeProcessStep;
  index: number;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={`relative flex min-w-0 flex-col rounded-2xl bg-cream p-2.5 max-lg:p-3 md:p-4 shadow-md ring-1 ring-dark-brown/5 ${className}`}
    >
      <div
        className="absolute left-2 top-2 z-10 flex h-7 w-7 max-lg:h-8 max-lg:w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gold font-serif text-xs max-lg:text-sm md:text-base font-bold text-dark-brown shadow-md ring-2 md:ring-4 ring-white lg:-left-2 lg:-top-2"
        aria-hidden="true"
      >
        {step.step}
      </div>

      <div className="mb-1.5 max-lg:mb-2 md:mb-3 pt-0.5 md:pt-1 text-center">
        <span className="text-[0.5625rem] max-lg:text-[0.625rem] md:text-xs font-medium uppercase tracking-widest text-gold-dark">
          Step {step.step}
        </span>
        <h3 className="mt-0.5 md:mt-1 font-serif text-sm max-lg:text-base md:text-lg font-bold leading-snug text-dark-brown lg:text-xl">
          {step.title}
        </h3>
      </div>

      <div className="mb-1.5 max-lg:mb-2 md:mb-3 overflow-hidden rounded-lg lg:rounded-xl shadow-sm ring-1 ring-dark-brown/5">
        <img
          src={step.image}
          alt={step.imageAlt}
          loading="lazy"
          className="aspect-[4/3] lg:aspect-[16/10] w-full object-cover"
        />
      </div>

      <p className="mt-auto text-center text-[0.6875rem] max-lg:text-xs md:text-sm leading-snug lg:leading-relaxed text-medium-brown">
        {step.description}
      </p>
    </motion.article>
  );
}

function FlowArrow({ direction }: { direction: 'right' | 'down' }) {
  const Icon = direction === 'right' ? ArrowRight : ArrowDown;
  return (
    <div
      className="pointer-events-none flex shrink-0 items-center justify-center text-gold"
      aria-hidden="true"
    >
      <Icon className="h-4 w-4 md:h-6 md:w-6" strokeWidth={2.5} />
    </div>
  );
}

export default function ProcessSection() {
  const rowOne = GHEE_PROCESS_STEPS.slice(0, 4);
  const rowTwo = GHEE_PROCESS_STEPS.slice(4);

  return (
    <section className="bg-farm-green-light/40 py-12 md:py-20 w-full min-w-0" aria-labelledby="ghee-process-heading">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center md:mb-16"
        >
          <span className="text-xs md:text-sm uppercase tracking-widest text-gold">How It&apos;s Made</span>
          <h2
            id="ghee-process-heading"
            className="mt-1.5 md:mt-2 mb-3 md:mb-4 font-serif text-3xl sm:text-4xl font-bold text-dark-brown md:text-5xl"
          >
            From Pasture to Jar
          </h2>
          <p className="mx-auto max-w-2xl text-sm md:text-base text-medium-brown px-1">
            Every jar follows the same traditional bilona journey — grass-fed cows, hand-churned
            butter, and slow wood-fire clarification. No shortcuts, no compromises.
          </p>
        </motion.div>

        {/* Desktop: 4+3 grid with flow arrows (lg+ unchanged) */}
        <div className="hidden lg:block">
          <div className="flex items-stretch justify-center gap-2 lg:gap-3">
            {rowOne.map((step, index) => (
              <div key={step.step} className="flex min-w-0 flex-1 items-stretch">
                <ProcessCard step={step} index={index} className="flex-1" />
                {index < rowOne.length - 1 && <FlowArrow direction="right" />}
              </div>
            ))}
          </div>

          <div className="my-4 flex justify-center text-gold" aria-hidden="true">
            <ArrowDown className="h-6 w-6" strokeWidth={2.5} />
          </div>

          <div className="mx-auto flex max-w-5xl items-stretch justify-center gap-2 lg:gap-3">
            {rowTwo.map((step, index) => (
              <div key={step.step} className="flex min-w-0 flex-1 items-stretch">
                <ProcessCard step={step} index={index + 4} className="flex-1" />
                {index < rowTwo.length - 1 && <FlowArrow direction="right" />}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & tablet: 2-column grid, no horizontal scroll */}
        <div className="lg:hidden min-w-0 overflow-x-clip">
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4">
            {GHEE_PROCESS_STEPS.map((step, index) => (
              <ProcessCard
                key={step.step}
                step={step}
                index={index}
                className={index === GHEE_PROCESS_STEPS.length - 1 ? 'col-span-2 mx-auto w-full max-w-[calc(50%-0.375rem)] sm:max-w-[calc(50%-0.5rem)]' : ''}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
