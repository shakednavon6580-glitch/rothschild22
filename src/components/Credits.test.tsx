import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Credits } from './Credits';
import { siteContentByLocale } from '../data/project';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const reducedMotionState = vi.hoisted(() => ({ enabled: false }));
const globalStyles = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8').replace(
  /@import[^;]+;/g,
  '',
);

vi.mock('framer-motion', () => ({
  motion: {
    div: forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'> & Record<string, unknown>>(
      ({ children, initial, whileInView, ...props }, ref) => (
        <div
          ref={ref}
          data-initial={JSON.stringify(initial)}
          data-while-in-view={JSON.stringify(whileInView)}
          {...props}
        >
          {children}
        </div>
      ),
    ),
  },
  useReducedMotion: () => reducedMotionState.enabled,
}));

describe('Credits section animation and content', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('removes the credits/exit eyebrow text while keeping heading and body', () => {
    render(<Credits content={siteContentByLocale.en.credits} />);

    expect(screen.queryByText('Credits / Exit')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'End of Experience' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Architecture, editorial direction, and visual storytelling aligned into one scroll narrative.',
      ),
    ).toBeInTheDocument();
  });

  it('renders a compact single-line mini-footer with the exact center copyright text', () => {
    render(<Credits content={siteContentByLocale.en.credits} />);

    expect(screen.getAllByLabelText('Site footer')).toHaveLength(1);
    expect(screen.getAllByLabelText('Brand')).toHaveLength(1);
    expect(screen.getByText('Shaked Navon')).toBeInTheDocument();
    expect(screen.getByText('© 2026 Shaked Navon. All rights reserved')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'LinkedIn profile' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/shaked-navon-801053393/',
    );
  });

  it('uses the same toolbar background token as the topbar', () => {
    expect(globalStyles).toMatch(/--toolbar-bg:\s*linear-gradient\(/);
    expect(globalStyles).toMatch(/\.topbar\s*\{[\s\S]*?background:\s*var\(--toolbar-bg\);/);
    expect(globalStyles).toMatch(/\.mini-footer\s*\{[\s\S]*?background:\s*var\(--toolbar-bg\);/);
  });

  it('uses cinematic reveal values when reduced motion is not preferred', () => {
    reducedMotionState.enabled = false;
    const { container } = render(<Credits content={siteContentByLocale.en.credits} />);
    const motionNodes = container.querySelectorAll('[data-initial][data-while-in-view]');

    expect(motionNodes.length).toBeGreaterThanOrEqual(2);
    expect(motionNodes[0]).toHaveAttribute(
      'data-initial',
      expect.stringContaining('"filter":"blur(10px)"'),
    );
    expect(motionNodes[0]).toHaveAttribute(
      'data-while-in-view',
      expect.stringContaining('"filter":"blur(0px)"'),
    );
  });

  it('uses minimal opacity-only reveal when reduced motion is preferred', () => {
    reducedMotionState.enabled = true;
    const { container } = render(<Credits content={siteContentByLocale.en.credits} />);
    const motionNodes = container.querySelectorAll('[data-initial][data-while-in-view]');

    expect(motionNodes[0]).toHaveAttribute('data-initial', '{"opacity":0}');
    expect(motionNodes[0]).toHaveAttribute('data-while-in-view', '{"opacity":1}');
  });
});
