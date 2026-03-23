export type ImageDimensions = {
  width: number;
  height: number;
};

const imageDimensionsBySrc = {
  '/assets/images/cover-aerial.png': { width: 2760, height: 1504 },
  '/assets/images/cover-brand.png': { width: 2760, height: 1504 },
  '/assets/images/drawing-interior.png': { width: 2502, height: 1696 },
  '/assets/images/drawing-structure.png': { width: 2760, height: 1504 },
  '/assets/images/glass-corner.png': { width: 2760, height: 1504 },
  '/assets/images/interior-portrait.png': { width: 2816, height: 1536 },
  '/assets/images/kitchen-view.png': { width: 2528, height: 1682 },
  '/assets/images/living-room.png': { width: 1792, height: 2390 },
  '/assets/images/night-aerial.png': { width: 2502, height: 1696 },
  '/assets/images/pool-perspective.png': { width: 2816, height: 1536 },
  '/assets/images/street-facade.png': { width: 2816, height: 1536 },
} as Record<string, ImageDimensions>;

export function getImageDimensions(src: string): ImageDimensions | undefined {
  const normalizedSrc = normalizeImageSrc(src);
  return imageDimensionsBySrc[normalizedSrc];
}

function normalizeImageSrc(src: string) {
  return src.split('?')[0]?.split('#')[0] ?? src;
}
