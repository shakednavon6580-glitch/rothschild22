import { getImageDimensions } from '../data/imageManifest';

type MediaImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function MediaImage({
  src,
  alt,
  className,
  priority = false,
  sizes = '100vw',
}: MediaImageProps) {
  const dimensions = getImageDimensions(src);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={dimensions?.width}
      height={dimensions?.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      sizes={sizes}
    />
  );
}
