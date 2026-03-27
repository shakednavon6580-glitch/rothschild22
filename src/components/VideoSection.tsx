import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useRef } from 'react';
import { SectionShell } from './SectionShell';
import type { VideoContent } from '../types/content';
import { resolveMediaSrc } from '../utils/media';

type FullscreenCapableVideo = HTMLVideoElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  webkitEnterFullscreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

export function VideoSection({
  id,
  title,
  eyebrow,
  subtitle,
  description,
  playLabel,
  unsupportedMessage,
  src,
  poster,
}: VideoContent) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoSrc = resolveMediaSrc(src);
  const posterSrc = resolveMediaSrc(poster);

  const requestFullscreen = async (videoElement: FullscreenCapableVideo) => {
    const fullscreenMethod =
      videoElement.requestFullscreen ??
      videoElement.webkitRequestFullscreen ??
      videoElement.msRequestFullscreen;

    if (fullscreenMethod) {
      try {
        await fullscreenMethod.call(videoElement);
        return;
      } catch {
        // Keep playback running when fullscreen is blocked by browser policy.
      }
    }

    // iPhone Safari supports a dedicated fullscreen API on video elements.
    if (videoElement.webkitEnterFullscreen) {
      try {
        await videoElement.webkitEnterFullscreen();
      } catch {
        // Keep playback inline if iOS fullscreen is blocked.
      }
    }
  };

  const playWithFallback = async (videoElement: HTMLVideoElement) => {
    try {
      await videoElement.play();
      return true;
    } catch {
      // Some mobile browsers can block script-driven playback unless muted.
      videoElement.muted = true;
      try {
        await videoElement.play();
        return true;
      } catch {
        return false;
      }
    }
  };

  const handlePlay = async () => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    videoElement.playsInline = true;

    const hasPlayed = await playWithFallback(videoElement);
    if (!hasPlayed) {
      videoElement.controls = true;
      videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    await requestFullscreen(videoElement as FullscreenCapableVideo);
    videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <SectionShell
      id={id}
      heading={title}
      eyebrow={eyebrow}
      subheading={description}
    >
      <motion.div
        className="film-panel"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
      >
        <div className="film-panel__intro">
          <p>{subtitle}</p>
          <button className="button button--primary" type="button" onClick={handlePlay}>
            <Play size={16} />
            {playLabel}
          </button>
        </div>

        <video
          ref={videoRef}
          className="film-panel__video"
          controls
          playsInline
          aria-label={title}
          preload="metadata"
          poster={posterSrc}
        >
          <source src={videoSrc} type="video/mp4" />
          {unsupportedMessage}
        </video>
      </motion.div>
    </SectionShell>
  );
}
