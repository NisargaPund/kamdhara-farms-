import { useEffect, useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { resolveProductImageUrl } from '../../lib/storage';

interface ProductImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** When false, skips blend mode (for photos already on cream/transparent backgrounds). */
  blendBlack?: boolean;
  /** Used when the primary src fails to load (e.g. stale cart URL). */
  fallbackSrc?: string;
}

/**
 * Product jar photo on cream. Default is no blend — studio shots on cream/white
 * look correct as-is. Pass blendBlack for legacy uploads with baked-in black only.
 */
export default function ProductImage({
  className = '',
  blendBlack = false,
  alt = '',
  src,
  fallbackSrc,
  ...props
}: ProductImageProps) {
  const primarySrc = resolveProductImageUrl(typeof src === 'string' ? src : undefined);
  const resolvedFallback = resolveProductImageUrl(fallbackSrc);
  const [activeSrc, setActiveSrc] = useState(primarySrc);

  useEffect(() => {
    setActiveSrc(primarySrc);
  }, [primarySrc]);

  if (!activeSrc && !resolvedFallback) {
    return (
      <div
        aria-hidden
        className={
          'flex h-full w-full items-center justify-center rounded-md bg-cream text-xs text-medium-brown/50' +
          (className ? ` ${className}` : '')
        }
      >
        No image
      </div>
    );
  }

  return (
    <img
      alt={alt}
      {...props}
      src={activeSrc || resolvedFallback}
      onError={() => {
        if (resolvedFallback && activeSrc !== resolvedFallback) {
          setActiveSrc(resolvedFallback);
        }
      }}
      className={
        'object-contain object-center' +
        (blendBlack ? ' mix-blend-screen' : '') +
        (className ? ` ${className}` : '')
      }
    />
  );
}
