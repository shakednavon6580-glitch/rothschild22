import { createElement, forwardRef } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { siteContentByLocale } from '../data/project';
import { Navigation } from './Navigation';

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
          ) => {
            const animateX =
              animate &&
              typeof animate === 'object' &&
              'x' in animate &&
              (typeof animate.x === 'number' || typeof animate.x === 'string')
                ? String(animate.x)
                : undefined;

            return createElement(
              tagName,
              {
                ref,
                ...props,
                ...(animateX ? { 'data-motion-x': animateX } : {}),
              },
              children,
            );
          },
        ),
    },
  );

  return { motion };
});

describe('navigation drawer', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('keeps the English drawer off-canvas to the right until opened', () => {
    const onLocaleChange = vi.fn();
    const content = siteContentByLocale.en;
    const { container } = render(
      <Navigation
        chapters={content.chapters}
        dir={content.metadata.dir}
        navigation={content.navigation}
        locale="en"
        onLocaleChange={onLocaleChange}
      />,
    );

    const panel = container.querySelector('#toc-panel');
    const introLink = container.querySelector('#toc-panel a[href="#introduction"]');

    expect(panel).toHaveAttribute('data-motion-x', '100%');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(introLink).toHaveAttribute('tabindex', '-1');

    fireEvent.click(screen.getByRole('button', { name: 'עברית' }));
    expect(onLocaleChange).toHaveBeenCalledWith('he');

    fireEvent.click(screen.getByRole('button', { name: /chapters/i }));

    const openPanel = container.querySelector('#toc-panel');
    const openIntroLink = container.querySelector('#toc-panel a[href="#introduction"]');

    expect(openPanel).toHaveAttribute('data-motion-x', '0');
    expect(openPanel).toHaveAttribute('aria-hidden', 'false');
    expect(openIntroLink).toHaveAttribute('tabindex', '0');
  });

  it('keeps the Hebrew drawer off-canvas to the left until opened', () => {
    const content = siteContentByLocale.he;
    const { container } = render(
      <Navigation
        chapters={content.chapters}
        dir={content.metadata.dir}
        navigation={content.navigation}
        locale="he"
        onLocaleChange={vi.fn()}
      />,
    );

    const panel = container.querySelector('#toc-panel');
    const introLink = container.querySelector('#toc-panel a[href="#introduction"]');

    expect(screen.getByRole('button', { name: 'פרקים' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(panel).toHaveAttribute('data-motion-x', '-100%');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(introLink).toHaveAttribute('tabindex', '-1');

    fireEvent.click(screen.getByRole('button', { name: 'פרקים' }));

    const openPanel = container.querySelector('#toc-panel');
    const openIntroLink = container.querySelector('#toc-panel a[href="#introduction"]');

    expect(screen.getByRole('button', { name: 'פרקים' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(openPanel).toHaveAttribute('data-motion-x', '0');
    expect(openPanel).toHaveAttribute('aria-hidden', 'false');
    expect(openIntroLink).toHaveAttribute('tabindex', '0');
  });
});
