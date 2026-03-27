import { useEffect, useMemo, useState } from 'react';
import { getImageDimensions } from '../data/imageManifest';
import { resolveMediaSrc, toRelativeMediaSrc } from '../utils/media';

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
  const resolvedSrc = useMemo(() => resolveMediaSrc(src), [src]);
  const relativeFallbackSrc = useMemo(() => toRelativeMediaSrc(src), [src]);
  const [activeSrc, setActiveSrc] = useState(resolvedSrc);

  useEffect(() => {
    setActiveSrc(resolvedSrc);
  }, [resolvedSrc]);

  const handleLoadError = () => {
    if (relativeFallbackSrc !== activeSrc) {
      setActiveSrc(relativeFallbackSrc);
    }
  };

  return (
    <img
      src={activeSrc}
      alt={alt}
      className={className}
      width={dimensions?.width}
      height={dimensions?.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      sizes={sizes}
      onError={handleLoadError}
    />
  );
}
