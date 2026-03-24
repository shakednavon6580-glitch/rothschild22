import { motion, useReducedMotion } from 'framer-motion';
import type { CreditsContent } from '../types/content';

type CreditsProps = {
  content: CreditsContent;
};

export function Credits({ content }: CreditsProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <footer className="credits">
      <motion.div
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 22, filter: 'blur(10px)' }
        }
        whileInView={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0, filter: 'blur(0px)' }
        }
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: prefersReducedMotion ? 0.3 : 0.8, ease: 'easeOut' }}
      >
        <h2>{content.heading}</h2>
        <p>{content.body}</p>
      </motion.div>

      <motion.div
        className="credits__actions"
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: prefersReducedMotion ? 0.25 : 0.55, ease: 'easeOut', delay: 0.12 }}
      >
        <a className="button button--secondary" href="#cover">
          {content.backToCoverLabel}
        </a>
      </motion.div>
    </footer>
  );
}
