import type { ImgHTMLAttributes } from 'react';

interface ProductImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** When false, skips blend mode (for photos already on cream/transparent backgrounds). */
  blendBlack?: boolean;
}

/**
 * Product jar photo on cream. Default is no blend — studio shots on cream/white
 * look correct as-is. Pass blendBlack for legacy uploads with baked-in black only.
 */
export default function ProductImage({
  className = '',
  blendBlack = false,
  alt,
  ...props
}: ProductImageProps) {
  return (
    <img
      alt={alt}
      {...props}
      className={
        'object-contain object-center' +
        (blendBlack ? ' mix-blend-screen' : '') +
        (className ? ` ${className}` : '')
      }
    />
  );
}
