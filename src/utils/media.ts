const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;

export function resolveMediaSrc(src: string) {
  if (!src || ABSOLUTE_URL_PATTERN.test(src) || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  if (!src.startsWith('/')) {
    return src;
  }

  const normalizedBase = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');
  const normalizedPath = src.replace(/^\/+/, '');

  if (!normalizedBase) {
    return `/${normalizedPath}`;
  }

  return `${normalizedBase}/${normalizedPath}`;
}

export function toRelativeMediaSrc(src: string) {
  return src.startsWith('/') ? src.slice(1) : src;
}
