import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { DrawingItem, DrawingsSectionData } from '../types/content';
import { SectionShell } from './SectionShell';

type DrawingSectionProps = {
  section: DrawingsSectionData;
};

export function DrawingSection({ section }: DrawingSectionProps) {
  return (
    <SectionShell
      id={section.id}
      className="drawings"
      heading={section.heading}
      eyebrow={section.eyebrow}
      subheading={section.subheading}
    >
      <div className="drawings__grid">
        {section.items.map((item, index) => (
          <DrawingCard
            key={item.src}
            item={item}
            index={index}
            missingFileLabel={section.missingFileLabel}
          />
        ))}
      </div>

      <a className="drawings__cta" href={section.ctaHref}>
        {section.ctaLabel}
      </a>
    </SectionShell>
  );
}

type DrawingCardProps = {
  item: DrawingItem;
  index: number;
  missingFileLabel: string;
};

function DrawingCard({ item, index, missingFileLabel }: DrawingCardProps) {
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!hasError) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setAttempt((current) => current + 1);
      setHasError(false);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [hasError]);

  return (
    <motion.figure
      className="drawing-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.08 }}
    >
      {hasError ? (
        <div className="drawing-card__placeholder">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{item.title}</strong>
          <p>
            {missingFileLabel} `{item.src}`.
          </p>
        </div>
      ) : (
        <img
          src={`${item.src}?v=${attempt}`}
          alt={item.alt}
          className="drawing-card__image"
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
        />
      )}

      <figcaption className="drawing-card__caption">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <div>
          <strong>{item.title}</strong>
          <p>{item.caption}</p>
        </div>
      </figcaption>
    </motion.figure>
  );
}
