import { formatPrice } from './utils';

export function getDisplayPrice(
  basePrice: number,
  applyGst: boolean,
  gstRate: number
): number {
  if (!applyGst) return basePrice;
  return Math.round(basePrice * (1 + gstRate / 100));
}

export function getGstLabel(applyGst: boolean, gstRate: number): string | null {
  if (!applyGst) return null;
  const rate = Number(gstRate);
  if (rate > 0) return `incl. ${rate % 1 === 0 ? rate : rate.toFixed(2)}% GST`;
  return 'incl. GST';
}

export function formatPriceWithGst(
  basePrice: number,
  applyGst: boolean,
  gstRate: number
): { price: string; gstLabel: string | null } {
  return {
    price: formatPrice(getDisplayPrice(basePrice, applyGst, gstRate)),
    gstLabel: getGstLabel(applyGst, gstRate),
  };
}
