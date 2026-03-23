import { motion } from 'framer-motion';
import type { Chapter } from '../types/content';
import { MediaImage } from './MediaImage';

type ChapterSectionProps = {
  chapter: Chapter;
};

export function ChapterSection({ chapter }: ChapterSectionProps) {
  return (
    <section
      id={chapter.id}
      className={`chapter chapter--${chapter.layout ?? 'split'}`}
    >
      <motion.div
        className="chapter__content"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="chapter__number">{chapter.number}</p>
        <p className="eyebrow">{chapter.eyebrow}</p>
        <h2>{chapter.title}</h2>
        <p className="chapter__intro">{chapter.intro}</p>
        <div className="chapter__body">
          {chapter.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {chapter.quote && <blockquote>{chapter.quote}</blockquote>}
        <a className="chapter__cta" href={`#${nextAnchor(chapter.id)}`}>
          {chapter.cta}
        </a>
      </motion.div>

      <motion.div
        className="chapter__media"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <MediaImage
          src={chapter.image}
          alt={chapter.imageAlt}
          className="chapter__image"
          sizes="(max-width: 960px) 100vw, 50vw"
        />
      </motion.div>
    </section>
  );
}

function nextAnchor(current: string) {
  const order = [
    'vision',
    'context',
    'concept',
    'materiality',
    'interior',
    'spatial-experience',
    'gallery',
  ];

  const currentIndex = order.indexOf(current);
  return order[currentIndex + 1] ?? 'gallery';
}
