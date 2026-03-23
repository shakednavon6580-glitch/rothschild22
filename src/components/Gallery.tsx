import type { CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import type {
  Direction,
  GalleryItem,
  GallerySectionContent,
} from '../types/content';
import { MediaImage } from './MediaImage';
import { SectionShell } from './SectionShell';

type GalleryProps = {
  dir: Direction;
  section: GallerySectionContent;
};

export const GALLERY_MARQUEE_ITEM_WIDTH = 'clamp(16rem, 72vw, 23rem)';
export const GALLERY_MARQUEE_IMAGE_ASPECT_RATIO = '5 / 4';

const galleryMarqueeItemStyle: CSSProperties = {
  width: GALLERY_MARQUEE_ITEM_WIDTH,
};

const galleryMarqueeFrameStyle: CSSProperties = {
  aspectRatio: GALLERY_MARQUEE_IMAGE_ASPECT_RATIO,
};

export function Gallery({ dir, section }: GalleryProps) {
  const items = section.items;
  const prefersReducedMotion = useReducedMotion();
  const sequences = prefersReducedMotion ? [items] : [items, items];
  const marqueeDuration = `${Math.max(items.length * 7, 32)}s`;

  return (
    <SectionShell
      id={section.id}
      className="gallery gallery--marquee"
      heading={section.heading}
      eyebrow={section.eyebrow}
      subheading={section.subheading}
    >
      <div
        className={`gallery-marquee ${prefersReducedMotion ? 'gallery-marquee--static' : ''}`}
        data-marquee-state={prefersReducedMotion ? 'static' : 'animated'}
        dir="ltr"
        style={{ '--gallery-marquee-duration': marqueeDuration } as CSSProperties}
      >
        <div className="gallery-marquee__viewport" dir="ltr">
          <div
            className="gallery-marquee__track"
            data-testid="gallery-marquee-track"
            dir="ltr"
          >
            {sequences.map((sequence, copyIndex) => (
              <ul
                key={`gallery-sequence-${copyIndex}`}
                className="gallery-marquee__sequence"
                data-gallery-copy={copyIndex === 0 ? 'original' : 'duplicate'}
                dir="ltr"
                aria-hidden={copyIndex > 0}
              >
                {sequence.map((item, index) => (
                  <li
                    key={`${copyIndex}-${item.src}`}
                    className="gallery-marquee__item"
                    data-gallery-item={item.src}
                    data-gallery-width={GALLERY_MARQUEE_ITEM_WIDTH}
                    style={galleryMarqueeItemStyle}
                  >
                    <figure className="gallery-marquee__card">
                      <div
                        className="gallery-marquee__frame"
                        data-gallery-aspect-ratio={GALLERY_MARQUEE_IMAGE_ASPECT_RATIO}
                        data-testid="gallery-marquee-frame"
                        style={galleryMarqueeFrameStyle}
                      >
                        <MediaImage
                          src={item.src}
                          alt={item.alt}
                          className="gallery-marquee__image"
                          priority={copyIndex === 0 && index < 2}
                          sizes="(max-width: 720px) 72vw, 23rem"
                        />
                      </div>
                      <figcaption className="gallery-marquee__caption" dir={dir}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <p>{item.caption}</p>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
