import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownLeft, ArrowDownRight } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { MediaImage } from './MediaImage';
import type { Direction } from '../types/content';

const HAVE_CURRENT_DATA = 2;
const HAVE_FUTURE_DATA = 3;

export type HeroMediaSettledReason = 'video-ready' | 'video-error' | 'reduced-motion';

type HeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  meta: string[];
  coverVideo: string;
  coverImage: string;
  imageAlt: string;
  ctaLabel: string;
  scrollLabel: string;
  metaAriaLabel: string;
  dir: Direction;
  onMediaSettled?: (reason: HeroMediaSettledReason) => void;
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  description,
  meta,
  coverVideo,
  coverImage,
  imageAlt,
  ctaLabel,
  scrollLabel,
  metaAriaLabel,
  dir,
  onMediaSettled,
}: HeroProps) {
  const ArrowIcon = dir === 'rtl' ? ArrowDownLeft : ArrowDownRight;
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasSettledMediaRef = useRef(false);

  const settleMedia = useCallback(
    (reason: HeroMediaSettledReason) => {
      if (hasSettledMediaRef.current) {
        return;
      }

      hasSettledMediaRef.current = true;
      onMediaSettled?.(reason);
    },
    [onMediaSettled],
  );

  useEffect(() => {
    hasSettledMediaRef.current = false;
  }, [coverVideo, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      settleMedia('reduced-motion');
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    const handleLoadedData = () => {
      if (videoElement.readyState >= HAVE_CURRENT_DATA) {
        settleMedia('video-ready');
      }
    };

    const handleCanPlayThrough = () => {
      if (videoElement.readyState >= HAVE_FUTURE_DATA) {
        settleMedia('video-ready');
      }
    };

    const handleError = () => {
      settleMedia('video-error');
    };

    handleCanPlayThrough();
    handleLoadedData();

    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('canplaythrough', handleCanPlayThrough);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
      videoElement.removeEventListener('error', handleError);
    };
  }, [prefersReducedMotion, settleMedia]);

  return (
    <section className="hero" id="cover">
      <div className="hero__media" aria-hidden="true">
        {prefersReducedMotion ? (
          <MediaImage
            src={coverImage}
            alt={imageAlt}
            className="hero__image"
            priority
            sizes="100vw"
          />
        ) : (
          <video
            ref={videoRef}
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            poster={coverImage}
            preload="auto"
          >
            <source src={coverVideo} type="video/mp4" />
          </video>
        )}
        <div className="hero__veil" />
      </div>

      <div className="hero__content">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
        >
          {subtitle}
        </motion.p>

        <motion.p
          className="hero__description"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
        >
          {description}
        </motion.p>

        <motion.div
          className="hero__footer"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
        >
          <a className="button button--primary" href="#introduction">
            {ctaLabel}
            <ArrowIcon size={18} />
          </a>
          <ul className="hero__meta" aria-label={metaAriaLabel}>
            {meta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      <a className="hero__scroll" href="#introduction">
        {scrollLabel}
      </a>
    </section>
  );
}
