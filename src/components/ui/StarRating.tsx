import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
  reviewCount?: number;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
};

export default function StarRating({
  rating,
  size = 'md',
  reviewCount,
  className = '',
}: StarRatingProps) {
  const starSize = sizeClasses[size];

  return (
    <div className={'flex items-center gap-1.5 ' + className}>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={
              starSize +
              ' ' +
              (i < Math.floor(rating) ? 'text-gold fill-gold' : 'text-gray-300')
            }
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-medium-brown">({reviewCount} reviews)</span>
      )}
    </div>
  );
}
