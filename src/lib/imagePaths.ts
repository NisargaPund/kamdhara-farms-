/** Site logo (public/logo.png). */
export const SITE_LOGO = '/logo.png';

/** Public-folder story collage (farm, bilona, ghee jar). Cache-busted after replacing Pexels placeholder. */
export const STORY_IMAGE = `${encodeURI('/about section image.png')}?v=2`;

/** Ghee production process photos (public/images/process/). */
export const GHEE_PROCESS_IMAGES = {
  cowsGrazing: '/images/process/01-cows-grazing.png',
  milking: '/images/process/02-milking.png',
  curdMaking: '/images/process/03-curd-making.png',
  churning: '/images/process/04-bilona-churning.png',
  clarifying: '/images/process/05-clarifying-ghee.png',
  qualityCheck: '/images/process/06-quality-check.png',
  packaging: '/images/process/07-packaging.png',
} as const;
