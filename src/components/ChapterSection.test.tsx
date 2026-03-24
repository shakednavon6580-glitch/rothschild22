import { createElement, forwardRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChapterSection } from './ChapterSection';
import { siteContentByLocale } from '../data/project';

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

describe('ChapterSection', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders exactly one descriptive paragraph per chapter for chapters 01–06', () => {
    const chapters = siteContentByLocale.en.chapters;

    for (const chapter of chapters) {
      const { container } = render(<ChapterSection chapter={chapter} />);

      const introParagraphs = container.querySelectorAll('.chapter__intro');
      expect(introParagraphs).toHaveLength(1);

      const bodyContainer = container.querySelector('.chapter__body');
      expect(bodyContainer).toBeInTheDocument();
      const bodyParagraphs = bodyContainer?.querySelectorAll('p') ?? [];
      expect(bodyParagraphs).toHaveLength(0);

      cleanup();
    }
  });

  it('renders English chapter content correctly', () => {
    const visionChapter = siteContentByLocale.en.chapters.find((c) => c.number === '01');
    expect(visionChapter).toBeDefined();
    render(<ChapterSection chapter={visionChapter!} />);

    expect(screen.getByText('Vision')).toBeInTheDocument();
    expect(
      screen.getByText(/The project begins as a quiet monument/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/measured setbacks that preserve openness/),
    ).toBeInTheDocument();
  });

  it('renders Hebrew chapter content correctly', () => {
    const visionChapter = siteContentByLocale.he.chapters.find((c) => c.number === '01');
    expect(visionChapter).toBeDefined();
    render(<ChapterSection chapter={visionChapter!} />);

    expect(screen.getByText('חזון')).toBeInTheDocument();
    expect(
      screen.getByText(/הפרויקט נולד כמבנה שיודע לנכוח/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/במקום להתחרות בשדרה/),
    ).toBeInTheDocument();
  });

  it('preserves chapter layout structure: number, eyebrow, title, image, CTA', () => {
    const chapter = siteContentByLocale.en.chapters[0];
    const { container } = render(<ChapterSection chapter={chapter} />);

    expect(container.querySelector('.chapter__number')).toHaveTextContent('01');
    expect(container.querySelector('.eyebrow')).toHaveTextContent(
      'A coastal skyline statement',
    );
    expect(container.querySelector('h2')).toHaveTextContent('Vision');
    expect(container.querySelector('img')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('alt', chapter.imageAlt);
    expect(container.querySelector('.chapter__cta')).toHaveTextContent(
      'Continue to Context',
    );
  });

  it('renders quote for chapter 01', () => {
    const visionChapter = siteContentByLocale.en.chapters.find((c) => c.id === 'vision');
    render(<ChapterSection chapter={visionChapter!} />);

    expect(
      screen.getByText('One iconic frame should carry the chapter before the interface does.'),
    ).toBeInTheDocument();
  });

  it('swaps sides only for chapters 03 and 06', () => {
    const expectedLayoutsByChapterNumber = {
      '01': 'chapter--image-led',
      '02': 'chapter--split',
      '03': 'chapter--quiet-image-led',
      '04': 'chapter--split',
      '05': 'chapter--image-led',
      '06': 'chapter--split',
    } as const;

    for (const locale of ['en', 'he'] as const) {
      for (const chapter of siteContentByLocale[locale].chapters) {
        const { container } = render(<ChapterSection chapter={chapter} />);
        const section = container.querySelector('section');
        const expectedClass =
          expectedLayoutsByChapterNumber[
            chapter.number as keyof typeof expectedLayoutsByChapterNumber
          ];

        expect(section).toBeInTheDocument();
        expect(section).toHaveClass('chapter');
        expect(section).toHaveClass(expectedClass);

        cleanup();
      }
    }
  });
});
