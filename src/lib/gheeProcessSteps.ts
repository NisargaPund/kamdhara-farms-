import { GHEE_PROCESS_IMAGES } from './imagePaths';

export interface GheeProcessStep {
  step: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

/** Traditional bilona ghee journey — grass to jar. Swap images in public/images/process/. */
export const GHEE_PROCESS_STEPS: GheeProcessStep[] = [
  {
    step: 1,
    title: 'Grass-Fed Grazing',
    description:
      'Indigenous Gir cows graze on natural pastures, feeding on fresh grass and herbs for nutrient-rich A2 milk.',
    image: GHEE_PROCESS_IMAGES.cowsGrazing,
    imageAlt: 'Gir cows grazing on green pasture at Kamdhara Farms',
  },
  {
    step: 2,
    title: 'Fresh Milking',
    description:
      'Milk is collected fresh each morning with gentle, hygienic hand-milking — never rushed, always pure.',
    image: GHEE_PROCESS_IMAGES.milking,
    imageAlt: 'Fresh A2 milk being collected from Gir cows',
  },
  {
    step: 3,
    title: 'Curd Culturing',
    description:
      'Fresh milk is warmed and set into curd using natural cultures, the essential first step of the bilona method.',
    image: GHEE_PROCESS_IMAGES.curdMaking,
    imageAlt: 'Traditional curd being prepared from A2 milk',
  },
  {
    step: 4,
    title: 'Bilona Churning',
    description:
      'Curd is hand-churned in a wooden bilona to separate rich, golden butter — slow and patient, as it always was.',
    image: GHEE_PROCESS_IMAGES.churning,
    imageAlt: 'Butter being hand-churned using the traditional bilona method',
  },
  {
    step: 5,
    title: 'Slow Clarification',
    description:
      'Butter is slow-cooked over a wood fire until water evaporates and pure golden ghee emerges with its signature aroma.',
    image: GHEE_PROCESS_IMAGES.clarifying,
    imageAlt: 'Ghee being clarified over a traditional wood fire',
  },
  {
    step: 6,
    title: 'Quality Testing',
    description:
      'Every batch is checked for purity, aroma, and texture before it earns the Kamdhara name.',
    image: GHEE_PROCESS_IMAGES.qualityCheck,
    imageAlt: 'Quality inspection of freshly prepared ghee',
  },
  {
    step: 7,
    title: 'Careful Packaging',
    description:
      'Finished ghee is filled, sealed, and labeled in food-grade jars — farm-fresh, ready for your kitchen.',
    image: GHEE_PROCESS_IMAGES.packaging,
    imageAlt: 'Premium ghee jars being packed for delivery',
  },
];
