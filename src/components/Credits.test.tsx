import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Credits } from './Credits';
import { siteContentByLocale } from '../data/project';

const reducedMotionState = vi.hoisted(() => ({ enabled: false }));

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
