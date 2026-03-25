import { createElement, forwardRef } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { VideoSection } from './VideoSection';
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

describe('VideoSection playback', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('attempts fullscreen and keeps playback inside a user-initiated play click', async () => {
    render(<VideoSection {...siteContentByLocale.en.video} />);

    const video = document.querySelector('video') as HTMLVideoElement;
    const playSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);
    const scrollIntoViewMock = vi.fn();
    Object.defineProperty(video, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    });
    const fullscreenSpy = vi
      .fn()
      .mockResolvedValue(undefined);

    Object.defineProperty(video, 'requestFullscreen', {
      configurable: true,
      value: fullscreenSpy,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Play Film' }));

    await vi.waitFor(() => {
      expect(playSpy).toHaveBeenCalledTimes(1);
      expect(fullscreenSpy).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    });
  });

  it('degrades gracefully when fullscreen is unavailable', async () => {
    render(<VideoSection {...siteContentByLocale.en.video} />);

    const video = document.querySelector('video') as HTMLVideoElement;
    const playSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);
    const scrollIntoViewMock = vi.fn();
    Object.defineProperty(video, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    });

    Object.defineProperty(video, 'requestFullscreen', {
      configurable: true,
      value: undefined,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Play Film' }));

    await vi.waitFor(() => {
      expect(playSpy).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    });
  });
});
