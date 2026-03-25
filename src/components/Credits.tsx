import { motion } from 'framer-motion';
import type { CreditsContent } from '../types/content';

type CreditsProps = {
  content: CreditsContent;
};

export function Credits({ content }: CreditsProps) {
  return (
    <footer className="credits">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <p className="eyebrow">{content.eyebrow}</p>
        <h2>{content.heading}</h2>
        <p>{content.body}</p>
      </motion.div>

      <div className="credits__actions">
        <a className="button button--secondary" href="#cover">
          {content.backToCoverLabel}
        </a>
      </div>
    </footer>
  );
}
