import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Gallery,
  GALLERY_MARQUEE_IMAGE_ASPECT_RATIO,
  GALLERY_MARQUEE_ITEM_WIDTH,
} from './Gallery';
import { siteContentByLocale } from '../data/project';

const reducedMotionState = vi.hoisted(() => ({ enabled: false }));

vi.mock('framer-motion', () => ({
  motion: {
    div: forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
      ({ children, ...props }, ref) => (
        <div ref={ref} {...props}>
          {children}
        </div>
      ),
    ),
  },
  useReducedMotion: () => reducedMotionState.enabled,
}));

describe('Gallery marquee', () => {
  const englishGallerySection = siteContentByLocale.en.gallery;
  const hebrewGallerySection = siteContentByLocale.he.gallery;

  beforeEach(() => {
    reducedMotionState.enabled = false;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders all featured gallery photos in the primary sequence', () => {
    render(<Gallery dir="ltr" section={englishGallerySection} />);

    const originalSequence = document.querySelector(
      '[data-gallery-copy="original"]',
    ) as HTMLElement | null;

    expect(originalSequence).not.toBeNull();

    englishGallerySection.items.forEach((item) => {
      expect(within(originalSequence as HTMLElement).getByAltText(item.alt)).toBeInTheDocument();
    });
  });

  it('removes glass-corner from the marquee source and rendered output', () => {
    render(<Gallery dir="ltr" section={englishGallerySection} />);

    expect(englishGallerySection.items.some((item) => item.src.includes('glass-corner.png'))).toBe(
      false,
    );
    expect(screen.queryByAltText('Corner glass facade view')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Layered transparency and planted terraces'),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-gallery-item="/assets/images/glass-corner.png"]'),
    ).toBeNull();
  });

  it('uses cover-brand in the fourth gallery slot and removes street-facade from the marquee', () => {
    render(<Gallery dir="ltr" section={englishGallerySection} />);

    const originalSequence = document.querySelector(
      '[data-gallery-copy="original"]',
    ) as HTMLElement | null;
    const originalImages = within(originalSequence as HTMLElement).getAllByRole('img');

    expect(englishGallerySection.items[3]?.src).toBe('/assets/images/cover-brand.png');
    expect(originalImages[3]).toHaveAttribute('src', '/assets/images/cover-brand.png');
    expect(
      within(originalSequence as HTMLElement).getByText(
        'Layered terraces read as a single skyline silhouette',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-gallery-item="/assets/images/street-facade.png"]'),
    ).toHaveLength(0);
    expect(screen.queryByAltText('Street facade at sunset')).not.toBeInTheDocument();
  });

  it('uses a shared width and aspect ratio for every marquee item', () => {
    render(<Gallery dir="ltr" section={englishGallerySection} />);

    const itemElements = Array.from(
      document.querySelectorAll('[data-gallery-item]'),
    ) as HTMLElement[];
    const frameElements = screen.getAllByTestId('gallery-marquee-frame');

    expect(itemElements.length).toBeGreaterThan(0);
    expect(frameElements.length).toBe(itemElements.length);

    itemElements.forEach((itemElement) => {
      expect(itemElement).toHaveAttribute('data-gallery-width', GALLERY_MARQUEE_ITEM_WIDTH);
    });

    frameElements.forEach((frameElement) => {
      expect(frameElement).toHaveAttribute(
        'data-gallery-aspect-ratio',
        GALLERY_MARQUEE_IMAGE_ASPECT_RATIO,
      );
    });
  });

  it('duplicates the gallery sequence for a seamless infinite marquee', () => {
    render(<Gallery dir="ltr" section={englishGallerySection} />);

    const sequences = Array.from(
      document.querySelectorAll('[data-gallery-copy]'),
    ) as HTMLElement[];

    expect(sequences).toHaveLength(2);
    expect(sequences[1]).toHaveAttribute('aria-hidden', 'true');

    const originalSources = Array.from(sequences[0].querySelectorAll('img')).map((image) =>
      image.getAttribute('src'),
    );
    const duplicateSources = Array.from(sequences[1].querySelectorAll('img')).map((image) =>
      image.getAttribute('src'),
    );

    expect(duplicateSources).toEqual(originalSources);
    expect(screen.getByTestId('gallery-marquee-track')).toBeInTheDocument();
  });

  it('keeps the marquee motion subtree in ltr for Hebrew while captions remain rtl', () => {
    render(<Gallery dir="rtl" section={hebrewGallerySection} />);

    const marquee = document.querySelector('.gallery-marquee');
    const track = screen.getByTestId('gallery-marquee-track');
    const sequences = Array.from(
      document.querySelectorAll('[data-gallery-copy]'),
    ) as HTMLElement[];
    const captions = Array.from(document.querySelectorAll('.gallery-marquee__caption'));
    const originalSources = Array.from(sequences[0].querySelectorAll('img')).map((image) =>
      image.getAttribute('src'),
    );
    const duplicateSources = Array.from(sequences[1].querySelectorAll('img')).map((image) =>
      image.getAttribute('src'),
    );

    expect(marquee).toHaveAttribute('dir', 'ltr');
    expect(track).toHaveAttribute('dir', 'ltr');
    expect(sequences).toHaveLength(2);
    expect(originalSources).toEqual(duplicateSources);
    captions.forEach((caption) => {
      expect(caption).toHaveAttribute('dir', 'rtl');
    });
  });

  it('keeps the animated marquee stable in English with ltr motion and ltr captions', () => {
    render(<Gallery dir="ltr" section={englishGallerySection} />);

    const marquee = document.querySelector('.gallery-marquee');
    const track = screen.getByTestId('gallery-marquee-track');
    const captions = Array.from(document.querySelectorAll('.gallery-marquee__caption'));

    expect(marquee).toHaveAttribute('dir', 'ltr');
    expect(track).toHaveAttribute('dir', 'ltr');
    captions.forEach((caption) => {
      expect(caption).toHaveAttribute('dir', 'ltr');
    });
  });

  it('uses CSS marquee structure instead of timer-driven autoplay resets', () => {
    const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
    const setIntervalSpy = vi.spyOn(window, 'setInterval');

    render(<Gallery dir="ltr" section={englishGallerySection} />);

    expect(setTimeoutSpy).not.toHaveBeenCalled();
    expect(setIntervalSpy).not.toHaveBeenCalled();
    expect(document.querySelector('[data-marquee-state="animated"]')).toBeInTheDocument();
  });

  it('switches to a single static strip when reduced motion is preferred', () => {
    reducedMotionState.enabled = true;

    render(<Gallery dir="rtl" section={hebrewGallerySection} />);

    const sequences = document.querySelectorAll('[data-gallery-copy]');
    const captions = Array.from(document.querySelectorAll('.gallery-marquee__caption'));

    expect(sequences).toHaveLength(1);
    expect(document.querySelector('[data-marquee-state="static"]')).toBeInTheDocument();
    expect(screen.getByTestId('gallery-marquee-track')).toBeInTheDocument();
    captions.forEach((caption) => {
      expect(caption).toHaveAttribute('dir', 'rtl');
    });
  });
});
