import { motion, useReducedMotion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import type { CreditsContent } from '../types/content';

type CreditsProps = {
  content: CreditsContent;
  logoUrl?: string;
};

export function Credits({ content, logoUrl }: CreditsProps) {
  const prefersReducedMotion = useReducedMotion();
  const revealInitial = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 24, filter: 'blur(10px)' };
  const revealInView = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: 'blur(0px)' };

  return (
    <>
      <section className="credits">
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
      </section>

      <footer className="site-footer" role="contentinfo" aria-label="Site footer">
        <div className="site-footer__row">
          <div className="site-footer__brand" aria-label="Brand">
            {logoUrl ? <img src={logoUrl} alt="Shaked Navon logo" height="24" /> : 'Shaked Navon'}
          </div>
          <div className="site-footer__copyright">
            © 2026 Shaked Navon. All rights reserved
          </div>
          <a
            className="site-footer__link"
            href="https://www.linkedin.com/in/shaked-navon-801053393/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <Linkedin size={18} aria-hidden="true" focusable="false" />
          </a>
        </div>
      </footer>
    </>
  );
}
  
