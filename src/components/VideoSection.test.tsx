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

  it.each([
    { label: 'iPhone', width: 390, height: 844 },
    { label: 'Android narrow', width: 360, height: 800 },
    { label: 'Small tablet portrait', width: 768, height: 1024 },
  ])('keeps mobile-compatible video attributes for $label viewport', ({ width, height }) => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: width,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: height,
      writable: true,
    });

    render(<VideoSection {...siteContentByLocale.en.video} />);

    const video = document.querySelector('video') as HTMLVideoElement;
    const source = video.querySelector('source');

    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('controls');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('preload', 'metadata');
    expect(video).toHaveAttribute('aria-label', 'Final Film');
    expect(video).toHaveAttribute('poster', siteContentByLocale.en.video.poster);
    expect(source).toHaveAttribute('type', 'video/mp4');
    expect(source).toHaveAttribute('src', '/assets/videos/final.video.mp4');
  });

  it('retries playback muted when mobile playback policy blocks the first play attempt', async () => {
    render(<VideoSection {...siteContentByLocale.en.video} />);

    const video = document.querySelector('video') as HTMLVideoElement;
    const playSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValueOnce(new DOMException('Blocked', 'NotAllowedError'))
      .mockResolvedValueOnce(undefined);
    const scrollIntoViewMock = vi.fn();
    const fullscreenSpy = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(video, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    });
    Object.defineProperty(video, 'requestFullscreen', {
      configurable: true,
      value: fullscreenSpy,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Play Film' }));

    await vi.waitFor(() => {
      expect(playSpy).toHaveBeenCalledTimes(2);
      expect(video.muted).toBe(true);
      expect(fullscreenSpy).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    });
  });

  it('uses iOS video fullscreen fallback when generic fullscreen APIs are unavailable', async () => {
    render(<VideoSection {...siteContentByLocale.en.video} />);

    const video = document.querySelector('video') as HTMLVideoElement;
    const playSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);
    const scrollIntoViewMock = vi.fn();
    const webkitEnterFullscreenSpy = vi.fn();

    Object.defineProperty(video, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    });
    Object.defineProperty(video, 'requestFullscreen', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(video, 'webkitRequestFullscreen', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(video, 'msRequestFullscreen', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(video, 'webkitEnterFullscreen', {
      configurable: true,
      value: webkitEnterFullscreenSpy,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Play Film' }));

    await vi.waitFor(() => {
      expect(playSpy).toHaveBeenCalledTimes(1);
      expect(webkitEnterFullscreenSpy).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    });
  });
});
