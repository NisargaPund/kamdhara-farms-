export function parseSizeToMl(size: string): number {
  const normalized = size.trim().toLowerCase().replace(/\s+/g, '');
  const mlMatch = normalized.match(/^(\d+(?:\.\d+)?)ml$/);
  if (mlMatch) return parseFloat(mlMatch[1]);

  const literMatch = normalized.match(/^(\d+(?:\.\d+)?)(l|liter|litre)$/);
  if (literMatch) return parseFloat(literMatch[1]) * 1000;

  const num = parseFloat(normalized);
  return Number.isNaN(num) ? 0 : num;
}

export function sortVariantsBySize<T extends { size: string }>(variants: T[]): T[] {
  return [...variants].sort((a, b) => parseSizeToMl(a.size) - parseSizeToMl(b.size));
}

export function formatSizeDisplay(size: string): string {
  const normalized = size.trim().toLowerCase().replace(/\s+/g, '');
  if (/^1(l|liter|litre)$/.test(normalized) || normalized === '1000ml') {
    return '1 liter';
  }
  return size;
}

export function formatBottleLabel(quantity: number, size: string): string {
  const sizeLabel = formatSizeDisplay(size);
  const bottleWord = quantity === 1 ? 'bottle' : 'bottles';
  return `${quantity} ${bottleWord} of ${sizeLabel}`;
}

export function getVariantImageUrl(
  variant: { image_url?: string | null },
  product: { image_url: string }
): string {
  return variant.image_url?.trim() || product.image_url;
}

export function getProductDetailImages(
  product: { image_url: string; gallery_urls?: string[] | null },
  variants: { image_url?: string | null }[]
): string[] {
  const urls = [
    ...variants.map((v) => v.image_url?.trim()).filter(Boolean) as string[],
    product.image_url,
    ...(product.gallery_urls || []),
  ];
  return [...new Set(urls.filter(Boolean))];
}

