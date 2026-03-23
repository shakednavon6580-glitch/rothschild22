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
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      sizes={sizes}
    />
  );
}
