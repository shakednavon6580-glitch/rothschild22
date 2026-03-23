import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement, forwardRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { siteContentByLocale } from '../data/project';
import { Hero } from './Hero';

let prefersReducedMotion = false;

vi.mock('framer-motion', () => {
  const motion = new Proxy(
    {},
    {
      get: (_, tagName: string) =>
        forwardRef<HTMLElement, Record<string, unknown>>(
          (
            {
              children,
              animate,
              initial,
              transition,
              viewport,
              whileInView,
              ...props
            },
            ref,
          ) => createElement(tagName, { ref, ...props }, children),
        ),
    },
  );

  return {
    motion,
    useReducedMotion: () => prefersReducedMotion,
  };
});

describe('hero media', () => {
  beforeEach(() => {
    prefersReducedMotion = false;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('keeps the hero overlay content rendered correctly in both English and Hebrew', () => {
    const englishHero = siteContentByLocale.en.hero;
    const hebrewHero = siteContentByLocale.he.hero;
    const englishView = render(<Hero {...englishHero} dir="ltr" />);

    expect(englishView.container.querySelector('.hero__content')).toBeInTheDocument();
    expect(screen.getByText(englishHero.eyebrow)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: englishHero.ctaLabel })).toBeInTheDocument();

    englishView.unmount();

    const hebrewView = render(<Hero {...hebrewHero} dir="rtl" />);

    expect(hebrewView.container.querySelector('.hero__content')).toBeInTheDocument();
    expect(screen.getByText(hebrewHero.eyebrow)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: hebrewHero.ctaLabel })).toBeInTheDocument();
  });

  it('renders a background video with the expected autoplay behavior while keeping the overlay content intact', () => {
    const hero = siteContentByLocale.en.hero;
    const { container } = render(<Hero {...hero} dir="ltr" />);

    const section = container.querySelector('section.hero');
    const media = container.querySelector('.hero__media');
    const veil = container.querySelector('.hero__veil');
    const content = container.querySelector('.hero__content');
    const video = container.querySelector('.hero__video') as HTMLVideoElement | null;
    const source = video?.querySelector('source');

    expect(section).toHaveAttribute('id', 'cover');
    expect(media).toHaveAttribute('aria-hidden', 'true');
    expect(video).toBeInTheDocument();
    expect(video?.autoplay).toBe(true);
    expect(video?.muted).toBe(true);
    expect(video?.loop).toBe(true);
    expect(video?.playsInline).toBe(true);
    expect(video).toHaveAttribute('poster', hero.coverImage);
    expect(source).toHaveAttribute('src', hero.coverVideo);
    expect(veil).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('hero__content');
    expect(screen.getByRole('heading', { name: hero.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: hero.scrollLabel })).toBeInTheDocument();
  });

  it('falls back to the existing hero image when reduced motion is preferred', () => {
    prefersReducedMotion = true;

    const hero = siteContentByLocale.he.hero;
    const { container } = render(<Hero {...hero} dir="rtl" />);

    const image = container.querySelector('.hero__image');

    expect(container.querySelector('.hero__video')).not.toBeInTheDocument();
    expect(image).toHaveAttribute('src', hero.coverImage);
    expect(image).toHaveAttribute('alt', hero.imageAlt);
    expect(container.querySelector('.hero__content')).toBeInTheDocument();
    expect(screen.getByText(hero.eyebrow)).toBeInTheDocument();
  });

  it('uses a lighter glass treatment for the hero overlay while preserving layering styles', () => {
    const styles = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');
    const backgroundAlphaMatch = styles.match(
      /--hero-content-bg:\s*rgba\(\s*20,\s*20,\s*18,\s*([0-9.]+)\s*\)/,
    );

    expect(backgroundAlphaMatch).not.toBeNull();
    expect(Number(backgroundAlphaMatch?.[1] ?? 1)).toBeLessThan(0.18);
    expect(styles).toContain('--hero-content-blur: 8px;');
    expect(styles).toMatch(
      /\.hero__content\s*\{[\s\S]*?z-index:\s*1;[\s\S]*?border:\s*1px solid var\(--hero-content-border\);[\s\S]*?background:[\s\S]*?var\(--hero-content-bg\);[\s\S]*?box-shadow:\s*var\(--hero-content-shadow\);[\s\S]*?backdrop-filter:\s*blur\(var\(--hero-content-blur\)\);[\s\S]*?\}/,
    );
  });
});
