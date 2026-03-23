import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownLeft, ArrowDownRight } from 'lucide-react';
import { MediaImage } from './MediaImage';
import type { Direction } from '../types/content';

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
}: HeroProps) {
  const ArrowIcon = dir === 'rtl' ? ArrowDownLeft : ArrowDownRight;
  const prefersReducedMotion = useReducedMotion();

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
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            poster={coverImage}
            preload="metadata"
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
