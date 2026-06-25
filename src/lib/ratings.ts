const DEFAULT_RATING = 5;

export function getAverageRating(reviews?: { rating: number }[]): number {
  if (!reviews?.length) return DEFAULT_RATING;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export function getReviewCount(reviews?: unknown[]): number {
  return reviews?.length ?? 0;
}
