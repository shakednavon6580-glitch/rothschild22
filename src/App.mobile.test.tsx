import { createElement, forwardRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const reducedMotionState = vi.hoisted(() => ({ enabled: true }));

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
});
