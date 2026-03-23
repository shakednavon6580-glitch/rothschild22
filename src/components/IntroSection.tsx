import { motion } from 'framer-motion';
import { SectionShell } from './SectionShell';
import type { IntroContent } from '../types/content';

type IntroSectionProps = {
  content: IntroContent;
};

export function IntroSection({ content }: IntroSectionProps) {
  return (
    <SectionShell
      id={content.id}
      heading={content.heading}
      eyebrow={content.eyebrow}
      subheading={content.subheading}
    >
      <div className="intro-grid">
        <motion.div
          className="intro-grid__copy"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p>{content.body}</p>
          <a className="button button--secondary" href={content.ctaHref}>
            {content.ctaLabel}
          </a>
        </motion.div>

        <motion.dl
          className="facts-grid"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          {content.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </SectionShell>
  );
}
