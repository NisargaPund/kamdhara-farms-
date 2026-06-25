/** Public-folder story collage (farm, bilona, ghee jar). Cache-busted after replacing Pexels placeholder. */
export const STORY_IMAGE = `${encodeURI('/about section image.png')}?v=2`;

/**
 * Ghee production process images (public/images/process/).
 * Replace .svg placeholders with .jpg or .webp photos using the same filenames.
 */
export const GHEE_PROCESS_IMAGES = {
  cowsGrazing: '/images/process/01-cows-grazing.svg',
  milking: '/images/process/02-milking.svg',
  curdMaking: '/images/process/03-curd-making.svg',
  churning: '/images/process/04-bilona-churning.svg',
  clarifying: '/images/process/05-clarifying-ghee.svg',
  qualityCheck: '/images/process/06-quality-check.svg',
  packaging: '/images/process/07-packaging.svg',
} as const;
