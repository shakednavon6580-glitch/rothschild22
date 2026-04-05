import { createElement, forwardRef } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { PRELOADER_EXIT_MS, PRELOADER_FALLBACK_MS } from './components/preloaderConfig';

let prefersReducedMotion = false;

vi.mock('framer-motion', () => {
  const motion = new Proxy(
    {},
    {
      get: (_, tagName: string) =>
        forwardRef<HTMLElement, Record<string, unknown>>(
          ({ children, animate, initial, transition, viewport, whileInView, ...props }, ref) =>
            createElement(tagName, { ref, ...props }, children),
        ),
    },
  );

  return {
    motion,
    useReducedMotion: () => prefersReducedMotion,
  };
});

function setReadyState(video: HTMLVideoElement, readyState: number) {
  Object.defineProperty(video, 'readyState', {
    configurable: true,
    get: () => readyState,
  });
}

describe('site preloader', () => {
  beforeEach(() => {
    prefersReducedMotion = false;
    vi.useFakeTimers();
    document.body.className = '';
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.className = '';
  });

  it('shows immediately and stays visible while the hero video is still waiting for data', () => {
    render(<App />);

    const preloader = screen.getByTestId('site-preloader');
    const heroVideo = document.querySelector('.hero__video') as HTMLVideoElement | null;

    expect(preloader).toHaveAttribute('data-state', 'active');
    expect(document.body).toHaveClass('body--preloader-active');
    expect(heroVideo).toBeInTheDocument();

    setReadyState(heroVideo as HTMLVideoElement, 1);
    fireEvent(heroVideo as HTMLVideoElement, new Event('loadeddata'));

    act(() => {
      vi.advanceTimersByTime(PRELOADER_FALLBACK_MS - 1);
    });

    expect(screen.getByTestId('site-preloader')).toHaveAttribute('data-state', 'active');
    expect(screen.getByTestId('site-preloader')).toHaveAttribute('data-exit-reason', 'pending');
  });

  it('hides only after the hero video reaches a ready playback state', () => {
    render(<App />);

    const heroVideo = document.querySelector('.hero__video') as HTMLVideoElement | null;

    setReadyState(heroVideo as HTMLVideoElement, 1);
    fireEvent(heroVideo as HTMLVideoElement, new Event('loadeddata'));
    expect(screen.getByTestId('site-preloader')).toHaveAttribute('data-state', 'active');

    setReadyState(heroVideo as HTMLVideoElement, 3);
    fireEvent(heroVideo as HTMLVideoElement, new Event('canplaythrough'));

    expect(screen.getByTestId('site-preloader')).toHaveAttribute('data-state', 'exiting');
    expect(screen.getByTestId('site-preloader')).toHaveAttribute('data-exit-reason', 'video-ready');

    act(() => {
      vi.advanceTimersByTime(PRELOADER_EXIT_MS);
    });

    expect(screen.queryByTestId('site-preloader')).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass('body--preloader-active');
  });

  it('dismisses gracefully if the hero video errors', () => {
    render(<App />);

    const heroVideo = document.querySelector('.hero__video') as HTMLVideoElement | null;
    fireEvent(heroVideo as HTMLVideoElement, new Event('error'));

    expect(screen.getByTestId('site-preloader')).toHaveAttribute('data-state', 'exiting');
    expect(screen.getByTestId('site-preloader')).toHaveAttribute('data-exit-reason', 'video-error');

    act(() => {
      vi.advanceTimersByTime(PRELOADER_EXIT_MS);
    });

    expect(screen.queryByTestId('site-preloader')).not.toBeInTheDocument();
  });

  it('falls back after the timeout when the hero video stalls indefinitely', () => {
    render(<App />);

    act(() => {
      vi.advanceTimersByTime(PRELOADER_FALLBACK_MS);
    });

    expect(screen.getByTestId('site-preloader')).toHaveAttribute('data-state', 'exiting');
    expect(screen.getByTestId('site-preloader')).toHaveAttribute('data-exit-reason', 'timeout');

    act(() => {
      vi.advanceTimersByTime(PRELOADER_EXIT_MS);
    });

    expect(screen.queryByTestId('site-preloader')).not.toBeInTheDocument();
  });
});
