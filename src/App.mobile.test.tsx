import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement, forwardRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const reducedMotionState = vi.hoisted(() => ({ enabled: true }));
const globalStyles = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8').replace(
  /@import[^;]+;/g,
  '',
);

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
    useReducedMotion: () => reducedMotionState.enabled,
  };
});

describe('mobile image rendering', () => {
  beforeEach(() => {
    cleanup();
    reducedMotionState.enabled = true;
    window.localStorage.clear();
    document.head.innerHTML = '';
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 390,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 844,
      writable: true,
    });

    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-test-styles', 'global');
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('keeps intrinsic dimensions on mobile images so they paint reliably across sections', () => {
    render(<App />);

    const renderedImages = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];

    expect(renderedImages.length).toBeGreaterThan(0);
    renderedImages.forEach((image) => {
      expect(Number(image.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(image.getAttribute('height'))).toBeGreaterThan(0);
    });

    expect(screen.getByAltText('Aerial view of Rothschild 22 above the Tel Aviv skyline')).toHaveAttribute(
      'width',
      '2760',
    );
    expect(
      screen.getByAltText('Architectural interior drawing of the penthouse at Rothschild 22'),
    ).toHaveAttribute('height', '1696');
    expect(screen.getByAltText('Corner view with terrace and glazing')).toHaveAttribute(
      'width',
      '2760',
    );
    expect(screen.getByAltText('Aerial building hero view')).toHaveAttribute('height', '1504');
  });

  it('keeps responsive mobile images bounded by their containers instead of intrinsic height', () => {
    render(<App />);

    const heroImage = screen.getByAltText(
      'Aerial view of Rothschild 22 above the Tel Aviv skyline',
    );
    const drawingImage = screen.getByAltText(
      'Architectural interior drawing of the penthouse at Rothschild 22',
    );
    const chapterImage = screen.getByAltText('Corner view with terrace and glazing');
    const galleryImage = screen.getByAltText('Aerial building hero view');

    expect(window.getComputedStyle(heroImage).height).toBe('100%');
    expect(window.getComputedStyle(chapterImage).height).toBe('auto');
    expect(window.getComputedStyle(chapterImage).width).toBe('100%');
    expect(window.getComputedStyle(chapterImage).maxWidth).toBe('100%');
    expect(window.getComputedStyle(drawingImage).height).toBe('auto');
    expect(window.getComputedStyle(drawingImage).width).toBe('100%');
    expect(globalStyles).toMatch(
      /:where\(img\[width\]\[height\]\)\s*\{[\s\S]*?height:\s*auto;/,
    );
    expect(globalStyles).toMatch(
      /\.gallery-marquee__image\s*\{[\s\S]*?width:\s*100%;[\s\S]*?height:\s*100%;[\s\S]*?object-fit:\s*cover;/,
    );
    expect(globalStyles).toMatch(
      /@media \(max-width: 720px\)\s*\{[\s\S]*?\.chapter__image\s*\{[\s\S]*?min-height:\s*320px;/,
    );
  });
});
