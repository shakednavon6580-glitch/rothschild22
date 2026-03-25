import { motion, useReducedMotion } from 'framer-motion';
import type { CreditsContent } from '../types/content';

type CreditsProps = {
  content: CreditsContent;
};

export function Credits({ content }: CreditsProps) {
  const prefersReducedMotion = useReducedMotion();
  const revealInitial = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 24, filter: 'blur(10px)' };
  const revealInView = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: 'blur(0px)' };

  return (
    <footer className="credits">
      <motion.div
        initial={revealInitial}
        whileInView={revealInView}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2>{content.heading}</h2>
        <p>{content.body}</p>
      </motion.div>

      <motion.div
        className="credits__actions"
        initial={revealInitial}
        whileInView={revealInView}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: prefersReducedMotion ? 0 : 0.1 }}
      >
        <a className="button button--secondary" href="#cover">
          {content.backToCoverLabel}
        </a>
      </motion.div>

      <p className="legal-line">all rights reserved shaked navon 2026</p>
    </footer>
  );
}
