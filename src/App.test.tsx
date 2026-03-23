import { createElement, forwardRef } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { LOCALE_STORAGE_KEY, siteContentByLocale } from './data/project';

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
    useReducedMotion: () => false,
  };
});

describe('localized app shell', () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.title = '';
    document.head.innerHTML = '';
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('switches between English and Hebrew with localized copy and RTL document attributes', () => {
    render(<App />);

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'עברית' }));

    expect(document.documentElement.lang).toBe('he');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.title).toBe(siteContentByLocale.he.metadata.title);
    expect(
      document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ).toBe(siteContentByLocale.he.metadata.description);
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('he');
    expect(screen.getByRole('button', { name: 'עברית' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('אדריכלות. עריכה. יוקרה.')).toBeInTheDocument();
    expect(screen.queryByText('Architectural Editorial Luxury')).not.toBeInTheDocument();
    expect(screen.getByText('להתחיל את הסיור')).toBeInTheDocument();
    expect(screen.getAllByText('שרטוטים').length).toBeGreaterThan(0);
    expect(screen.getAllByText('סרט סיום').length).toBeGreaterThan(0);
    expect(screen.getByTestId('gallery-marquee-track')).toBeInTheDocument();
  });

  it('boots in Hebrew when the persisted locale is stored', () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'he');

    render(<App />);

    expect(document.documentElement.lang).toBe('he');
    expect(document.documentElement.dir).toBe('rtl');
    expect(screen.getByRole('button', { name: 'עברית' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('להיכנס לפרויקט')).toBeInTheDocument();
    expect(screen.queryByText('Enter Project')).not.toBeInTheDocument();
  });
});
